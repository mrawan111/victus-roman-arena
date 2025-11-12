import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI, cartAPI, cartProductsAPI, couponsAPI } from "@/lib/api";
import { Tag, X, CheckCircle, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OrderItem {
  id: number;
  variantId: number;
  quantity: number;
  priceAtTime: number;
  variant: {
    variantId: number;
    productId: number;
    color: string;
    size: string;
    price: number;
    product: {
      productId: number;
      productName: string;
      images: Array<{
        imageId: number;
        imageUrl: string;
        isPrimary: boolean;
      }>;
    };
  };
}

interface OrderDetails {
  orderId: number;
  email: string;
  address: string;
  phoneNum: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  orderItems: OrderItem[];
}

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: t("checkout.toasts.couponInvalidTitle"),
        description: t("checkout.toasts.couponInvalidDescription"),
        variant: "destructive",
      });
      return;
    }

    setValidatingCoupon(true);
    try {
      const result = await couponsAPI.validate(couponCode.trim().toUpperCase(), totalPrice);
      if (result.valid) {
        setAppliedCoupon({
          code: result.coupon_code!,
          discount: result.discount!,
          finalAmount: result.final_amount!,
        });
        toast({
          title: t("checkout.coupon.applied"),
          description: t("checkout.coupon.savedAmount", {
            amount: result.discount?.toFixed(2) ?? "0.00",
          }),
        });
        setCouponCode("");
      } else {
        toast({
          title: t("checkout.toasts.couponErrorTitle"),
          description: result.error || t("checkout.toasts.couponErrorDescription"),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t("checkout.toasts.couponNetworkErrorTitle"),
        description: error.message || t("checkout.toasts.couponNetworkErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const finalTotal = appliedCoupon ? appliedCoupon.finalAmount : totalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = Object.entries(formData);
    const emptyFields = requiredFields.filter(([_, value]) => !value.trim());
    
    if (emptyFields.length > 0) {
      toast({
        title: t("checkout.toasts.missingInfoTitle"),
        description: t("checkout.toasts.missingInfoDescription"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Try to get or create cart for user
      let cartId: number | null = null;
      try {
        const existingCart = await cartAPI.getByEmail(formData.email);
        cartId = existingCart.cartId;
      } catch {
        // Cart doesn't exist, create one
        const newCart = await cartAPI.create({
          email: formData.email,
          totalPrice: totalPrice,
          isActive: true,
        });
        cartId = newCart.cartId;
        
        // Add items to cart
        for (const item of items) {
          try {
            await cartProductsAPI.addToCart({
              variant_id: item.variantId,
              cart_id: cartId,
              quantity: item.quantity,
            });
          } catch (err) {
            console.error("Error adding item to cart:", err);
          }
        }

        // Recalculate cart total after adding items
        await cartAPI.calculateTotal(cartId);
      }

      // Create order from cart or directly
      let order;
      if (cartId) {
        try {
          const orderData = await ordersAPI.createFromCart(cartId, {
            address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
            phone_num: formData.phone,
            payment_method: "Credit Card",
            order_status: "pending",
            payment_status: "pending",
            clear_cart: true,
          });
          order = { orderId: orderData.order_id, totalPrice: orderData.total_price };
        } catch (cartOrderError) {
          // Fallback to direct order creation
          order = await ordersAPI.create({
            email: formData.email,
            address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
            phoneNum: formData.phone,
            totalPrice: finalTotal,
            orderStatus: "pending",
            paymentStatus: "pending",
            paymentMethod: "Credit Card",
          });
        }
      } else {
        // Direct order creation
        order = await ordersAPI.create({
          email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
          phoneNum: formData.phone,
          totalPrice: finalTotal,
          orderStatus: "pending",
          paymentStatus: "pending",
          paymentMethod: "Credit Card",
        });
      }

      // Fetch full order details immediately after creation
      const fullOrderDetails = await ordersAPI.getById(order.orderId);
      setOrderDetails(fullOrderDetails);
      setShowOrderConfirmation(true);

      toast({
        title: t("checkout.toasts.orderSuccessTitle"),
        description: t("checkout.toasts.orderSuccessDescription", {
          orderId: order.orderId,
          total: order.totalPrice.toFixed(2),
        }),
      });

      clearCart();
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: t("checkout.toasts.orderErrorTitle"),
        description: error.message || t("checkout.toasts.orderErrorDescription"),
        variant: "destructive",
      });
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12 sm:py-16 gradient-roman">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 sm:mb-4 text-center">
            {t("checkout.title")}
          </h1>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-4 sm:mb-6">
                    {t("checkout.sections.contact")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t("forms.firstName")}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholders.name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t("forms.lastName")}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholders.name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("forms.email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholders.email")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("forms.phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholders.phone")}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-4 sm:mb-6">
                    {t("checkout.sections.shipping")}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">{t("forms.address")}</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholders.address")}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">{t("forms.city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder={t("placeholders.city")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">{t("forms.zipCode")}</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          placeholder={t("placeholders.zipCode")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">{t("forms.country")}</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          placeholder={t("placeholders.country")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-4 sm:mb-6">
                    {t("checkout.sections.payment")}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">{t("forms.cardNumber")}</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder={t("placeholders.cardNumber")}
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">{t("forms.cardName")}</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder={t("placeholders.cardName")}
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">{t("forms.expiryDate")}</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder={t("placeholders.expiryDate")}
                          value={formData.expiryDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">{t("forms.cvv")}</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder={t("placeholders.cvv")}
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-elegant lg:sticky lg:top-24">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-4 sm:mb-6">
                    {t("checkout.sections.orderSummary")}
                  </h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} {item.variantDetails ? `(${item.variantDetails})` : ""} x{item.quantity}
                        </span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    {/* Coupon Code Section */}
                    <div className="border-t pt-4 space-y-2">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-800">
                              {appliedCoupon.code}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveCoupon}
                            className="h-6 w-6 p-0"
                            aria-label={t("checkout.coupon.remove")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="couponCode" className="text-sm">
                            {t("checkout.coupon.label")}
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="couponCode"
                              placeholder={t("checkout.coupon.placeholder")}
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleApplyCoupon();
                                }
                              }}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleApplyCoupon}
                              disabled={validatingCoupon || !couponCode.trim()}
                            >
                              {validatingCoupon ? t("checkout.coupon.validating") : t("checkout.coupon.apply")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-muted-foreground mb-2">
                        <span>{t("checkout.summary.subtotal")}</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600 mb-2">
                          <span>{t("checkout.coupon.discountLabel", { code: appliedCoupon.code })}</span>
                          <span>-${appliedCoupon.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground mb-2">
                        <span>{t("checkout.summary.shipping")}</span>
                        <span>{t("checkout.summary.free")}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-primary mt-4">
                        <span>{t("checkout.summary.total")}</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-roman text-lg py-6">
                    {t("checkout.buttons.placeOrder")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-center text-primary mb-2">
                {t("checkout.confirmation.title")}
              </h2>
              <p className="text-center text-sm sm:text-base text-muted-foreground mb-6">
                {t("checkout.confirmation.subtitle")}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-semibold">
                    {t("checkout.confirmation.orderNumber", { id: orderDetails.orderId })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    {t("checkout.confirmation.orderDate", {
                      date: new Date(orderDetails.orderDate).toLocaleDateString(),
                    })}
                  </p>
                  <p>{t("checkout.confirmation.status", { status: orderDetails.orderStatus })}</p>
                  <p>
                    {t("checkout.confirmation.payment", {
                      status: orderDetails.paymentStatus,
                      method: orderDetails.paymentMethod,
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold">{t("checkout.confirmation.itemsTitle")}</h3>
                {orderDetails.orderItems.map((item) => {
                  const primaryImage = item.variant?.product?.images?.find(img => img.isPrimary) || item.variant?.product?.images?.[0];
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {primaryImage ? (
                          <img
                            src={primaryImage.imageUrl}
                            alt={item.variant?.product?.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.variant?.product?.productName || "Product"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.variant?.color || "N/A"} / {item.variant?.size || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("checkout.confirmation.quantity", { count: item.quantity })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.priceAtTime.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${(item.priceAtTime * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t("checkout.confirmation.total")}</span>
                  <span>${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  onClick={() => navigate("/")}
                  className="flex-1 gradient-roman"
                >
                  {t("checkout.buttons.continueShopping")}
                </Button>
                <Button
                  onClick={() => {
                    setShowOrderConfirmation(false);
                    setOrderDetails(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  {t("checkout.buttons.close")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;
