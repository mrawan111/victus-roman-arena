import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-marble">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-roman">
                <span className="text-xl font-display font-bold text-primary-foreground">V</span>
              </div>
              <span className="text-xl font-display font-bold tracking-wider text-primary">
                VICTUS
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium martial arts equipment for champions. Inspired by the strength of ancient warriors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=boxing" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Boxing
                </Link>
              </li>
              <li>
                <Link to="/shop?category=mma" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  MMA
                </Link>
              </li>
              <li>
                <Link to="/shop?category=muay-thai" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Muay Thai
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kickboxing" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Kickboxing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0" />
                <span>123 Arena Street, Sports City, SC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-gold" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-gold" />
                <span>info@victus.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Victus. All rights reserved. Built with the strength of warriors.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
