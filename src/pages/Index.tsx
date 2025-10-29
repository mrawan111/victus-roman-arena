import { Link } from "react-router-dom";
import { ArrowRight, Shield, Award, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import heroImage from "@/assets/hero-martial-arts.jpg";

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const categories = [
    { name: "Boxing", slug: "boxing", icon: "🥊" },
    { name: "MMA", slug: "mma", icon: "🥋" },
    { name: "Muay Thai", slug: "muay-thai", icon: "🥷" },
    { name: "Kickboxing", slug: "kickboxing", icon: "👊" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block mb-4 px-4 py-2 bg-gold/20 border border-gold rounded-full">
              <span className="text-gold font-semibold text-sm">STRENGTH • HONOR • VICTORY</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Fight Like a
              <span className="block text-gold">Gladiator</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Premium martial arts equipment crafted with the precision of ancient Roman warriors. 
              Dominate your discipline with Victus.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gradient-gold text-primary hover:opacity-90 font-semibold">
                <Link to="/shop">
                  Shop All Equipment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/about">Learn Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Roman Column Decoration */}
        <div className="absolute bottom-0 right-0 w-32 h-full opacity-20 bg-gradient-to-t from-gold to-transparent" />
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
                <h3 className="font-display font-semibold text-lg text-primary mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Built to last with the finest materials, inspired by legendary craftsmanship.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-background shadow-elegant">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">Champion Approved</h3>
                <p className="text-sm text-muted-foreground">
                  Trusted by professional fighters and martial artists worldwide.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-lg bg-background shadow-elegant">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-primary mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $100. Get equipped quickly.
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
              Choose Your Discipline
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From the ancient arenas to modern combat sports, find equipment for every martial art.
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
              Featured Equipment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our most popular gear, chosen by warriors worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="gradient-roman">
              <Link to="/shop">
                View All Products
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
            Join the Legion of Champions
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gear up with equipment that's built for victory. Start your journey to greatness today.
          </p>
          <Button asChild size="lg" className="gradient-gold text-primary hover:opacity-90 font-semibold">
            <Link to="/shop">
              Start Shopping
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
