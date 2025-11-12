import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

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
              {t("footer.description")}
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
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">
              {t("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("footer.quickLinks.shopAll")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("footer.quickLinks.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("footer.quickLinks.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">
              {t("footer.categories.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop?category=boxing" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("categories.boxing")}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=mma" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("categories.mma")}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=muay-thai" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("categories.muayThai")}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kickboxing" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  {t("categories.kickboxing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-primary">
              {t("footer.contact.title")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("footer.contact.address")}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-gold" />
                <span>{t("footer.contact.phone")}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-gold" />
                <span>{t("footer.contact.email")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {t("footer.copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
