import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-marble">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-6xl sm:text-8xl font-display font-bold text-primary">404</h1>
          <h2 className="mb-4 text-2xl sm:text-3xl font-display font-semibold text-primary">Oops! Page not found</h2>
          <p className="mb-8 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gradient-roman">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
