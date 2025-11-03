import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(0, 100);
      // Map API products to match our ProductCard component
      const mappedProducts = response.content.map((product: any) => ({
        variantId: product.variants?.[0]?.variantId || 1, // Use first variant or default
        productId: product.productId,
        name: product.productName,
        price: product.basePrice,
        image: product.images?.[0]?.imageUrl || "/placeholder.svg",
        category: product.category?.categoryName || "Uncategorized",
        inStock: product.isActive !== false,
        description: product.description,
        features: [],
        variantDetails: product.variants?.[0]?.variantDetails || "",
      }));
      setProducts(mappedProducts);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Using fallback data.",
        variant: "destructive",
      });
      // Fallback to local data
      const { products: localProducts } = await import("@/data/products");
      setProducts(localProducts as any);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === "all") return true;
      return product.category.toLowerCase().replace(" ", "-") === selectedCategory;
    });
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [filteredProducts, sortBy]);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "boxing", label: "Boxing" },
    { value: "mma", label: "MMA" },
    { value: "muay-thai", label: "Muay Thai" },
    { value: "kickboxing", label: "Kickboxing" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <section className="py-16 gradient-roman">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 text-center">
            Equipment Arsenal
          </h1>
          <p className="text-xl text-white/90 text-center max-w-2xl mx-auto">
            Discover our complete collection of professional martial arts equipment
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? "gradient-roman" : ""}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
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

              {sortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
