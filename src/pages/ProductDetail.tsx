import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Shield, Truck, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-primary mb-4">Product Not Found</h1>
            <Button asChild>
              <Link to="/shop">Return to Shop</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-marble shadow-elegant">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Badge className="absolute top-4 left-4 bg-gold text-primary font-semibold">
                {product.category}
              </Badge>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-display font-bold text-primary mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-primary">${product.price}</span>
                  {product.inStock ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-xl text-primary mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-gold mt-1">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                <Button 
                  className="w-full gradient-roman text-lg py-6"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Quality Guarantee</p>
                    <p className="text-xs text-muted-foreground">Premium materials</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-sm">Pro Approved</p>
                    <p className="text-xs text-muted-foreground">Used by champions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
