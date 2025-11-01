import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ordersAPI, cartAPI, cartProductsAPI, couponsAPI } from "@/lib/api";
import { Tag, X } from "lucide-react";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a coupon code",
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
          title: "Coupon Applied!",
          description: `You saved $${result.discount?.toFixed(2)}`,
        });
        setCouponCode("");
      } else {
        toast({
          title: "Invalid Coupon",
          description: result.error || "This coupon cannot be applied",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to validate coupon",
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
        title: "Missing Information",
        description: "Please fill in all required fields",
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
          // For now, we'll use productId as variantId - in real app, you'd get the variant
          try {
            await cartProductsAPI.addToCart({
              variant_id: parseInt(item.id),
              cart_id: cartId,
              quantity: item.quantity,
            });
          } catch (err) {
            console.error("Error adding item to cart:", err);
          }
        }
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

      toast({
        title: "Order Placed Successfully!",
        description: `Order placed. Total: $${order.totalPrice.toFixed(2)}`,
      });

      clearCart();
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-16 gradient-roman">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 text-center">
            Checkout
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
                <div className="p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="p-6 rounded-lg border bg-card shadow-sm">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
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
                <div className="p-6 rounded-lg border bg-card shadow-elegant sticky top-24">
                  <h2 className="text-2xl font-display font-bold text-primary mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
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
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="couponCode" className="text-sm">Coupon Code</Label>
                          <div className="flex gap-2">
                            <Input
                              id="couponCode"
                              placeholder="Enter code"
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
                              {validatingCoupon ? "..." : "Apply"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-muted-foreground mb-2">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600 mb-2">
                          <span>Discount ({appliedCoupon.code})</span>
                          <span>-${appliedCoupon.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground mb-2">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-primary mt-4">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-roman text-lg py-6">
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
