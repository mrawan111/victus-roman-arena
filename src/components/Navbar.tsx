import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import victusLogo from "@/assets/victus-logo.png";

const Navbar = () => {
  const { totalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      try {
        const sessionData = JSON.parse(userSession);
        if (sessionData.loggedIn && sessionData.token) {
          setIsLoggedIn(true);
          setUser(sessionData.user);
        }
      } catch {
        // Invalid session
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setIsLoggedIn(false);
    setUser(null);
    toast({
      title: t("auth.loggedOut"),
      description: t("auth.loggedOutDesc"),
    });
    navigate("/");
  };
  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.shop"), path: "/shop" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={victusLogo} 
              alt="Victus Logo" 
              className="h-16 w-16 object-contain"
            />
            <span className="text-2xl font-display font-bold tracking-wider text-primary">
              VICTUS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.firstName || user?.email || t("nav.account")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/">{t("nav.myAccount")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">{t("nav.myOrders")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">{t("nav.signIn")}</Link>
                </Button>
                <Button asChild variant="default" size="sm" className="gradient-roman">
                  <Link to="/signup">{t("nav.signUp")}</Link>
                </Button>
              </div>
            )}
            
            <LanguageSwitcher />
            
            <Button asChild variant="default" size="icon" className="relative gradient-roman">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-primary">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Language Switcher in Mobile Menu */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Language</span>
                  </div>
                  <LanguageSwitcher fullWidth />
                </div>
                
                <div className="pt-4 border-t">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {user?.firstName || user?.email || t("nav.account")}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild variant="ghost" className="w-full">
                        <Link to="/login">
                          <User className="mr-2 h-4 w-4" />
                          {t("nav.signIn")}
                        </Link>
                      </Button>
                      <Button asChild variant="default" className="w-full gradient-roman">
                        <Link to="/signup">{t("nav.signUp")}</Link>
                      </Button>
                    </div>
                  )}
                </div>
                <Button asChild variant="default" className="w-full gradient-roman">
                  <Link to="/cart">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {t("nav.cart")} ({totalItems})
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
