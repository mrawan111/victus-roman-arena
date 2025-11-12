import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  variantId: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock?: boolean;
  variantDetails?: string;
}

const ProductCard = ({
  variantId,
  productId,
  name,
  price,
  image,
  category,
  inStock = true,
  variantDetails,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  
  return (
    <Card className="group overflow-hidden shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${productId}`}>
        <div className="relative overflow-hidden aspect-square bg-marble">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute top-4 left-4 bg-gold text-primary font-semibold">
            {category}
          </Badge>
          {!inStock && (
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              {t("productCard.outOfStock")}
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/product/${productId}`}>
          <h3 className="font-display font-semibold text-lg text-primary group-hover:text-gold transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full gradient-roman hover:opacity-90 transition-opacity"
              disabled={!inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {inStock ? t("productCard.addToCart") : t("productCard.outOfStock")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("productCard.confirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <strong>{t("productCard.product")}</strong> {name}
                <br />
                <strong>{t("productCard.price")}</strong> ${price}
                <br />
                {variantDetails && (
                  <>
                    <strong>{t("productCard.variant")}</strong> {variantDetails}
                    <br />
                  </>
                )}
                <strong>{t("productCard.category")}</strong> {category}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("productCard.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({ variantId, productId, name, price, image, category, variantDetails });
                }}
              >
                {t("productCard.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
