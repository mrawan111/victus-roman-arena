import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsAPI } from "@/lib/api";
import { products as fallbackProducts } from "@/data/products";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-martial-arts.jpg";

const Index = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll(0, 4);
      // Map API products to match ProductCard component
      const mappedProducts = response.content.map((product: any) => ({
        variantId: product.variants?.[0]?.variantId || 1,
        productId: product.productId,
        name: product.productName,
        price: product.basePrice,
        image: product.images?.[0]?.imageUrl || "/placeholder.svg",
        category: product.category?.categoryName || "Uncategorized",
        inStock: product.isActive !== false,
        variantDetails: product.variants?.[0]?.variantDetails || "",
      }));
      setFeaturedProducts(mappedProducts);
    } catch (error) {
      console.error("Error loading featured products:", error);
      // Fallback to local data
      setFeaturedProducts(fallbackProducts.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };
  const categories = [
    { name: t("categories.boxing"), slug: "boxing", icon: "🥊" },
    { name: t("categories.mma"), slug: "mma", icon: "🥋" },
    { name: t("categories.muayThai"), slug: "muay-thai", icon: "🥷" },
    { name: t("categories.kickboxing"), slug: "kickboxing", icon: "👊" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/20 border border-gold rounded-full">
              <span className="text-gold font-semibold text-xs sm:text-sm">{t("hero.tagline")}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t("hero.title")}
              <span className="block text-gold">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button asChild size="lg" className="gradient-gold text-primary hover:opacity-90 font-semibold text-sm sm:text-base">
                <Link to="/shop">
                  {t("hero.shopAll")}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-sm sm:text-base">
                <Link to="/about">{t("hero.learnStory")}</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Roman Column Decoration */}
        <div className="absolute bottom-0 right-0 w-16 sm:w-32 h-full opacity-20 bg-gradient-to-t from-gold to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 bg-marble">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-background shadow-elegant">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">{t("features.premiumQuality.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.premiumQuality.description")}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-background shadow-elegant">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">{t("features.championApproved.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.championApproved.description")}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-background shadow-elegant">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">{t("features.fastShipping.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("features.fastShipping.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              {t("categories.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br from-marble to-marble-dark shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-6xl mb-4">{category.icon}</span>
                  <h3 className="font-display font-bold text-2xl text-primary group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-marble">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              {t("products.featured.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("products.featured.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`${product.productId}-${product.variantId}`}
                  variantId={product.variantId}
                  productId={product.productId}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  inStock={product.inStock}
                  variantDetails={product.variantDetails}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" className="gradient-roman">
              <Link to="/shop">
                {t("products.featured.viewAll")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-roman">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Button asChild size="lg" className="gradient-gold text-primary hover:opacity-90 font-semibold">
            <Link to="/shop">
              {t("cta.startShopping")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
