import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  Settings,
  FileText,
  Warehouse,
  Folder,
  Store,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, key: "dashboard", end: true },
  { to: "/admin/products", icon: Package, key: "products" },
  { to: "/admin/categories", icon: Folder, key: "categories" },
  { to: "/admin/variants", icon: Layers, key: "variants" },
  { to: "/admin/images", icon: ImageIcon, key: "images" },
  { to: "/admin/orders", icon: ShoppingCart, key: "orders" },
  { to: "/admin/customers", icon: Users, key: "customers" },
  { to: "/admin/sellers", icon: Store, key: "sellers" },
  { to: "/admin/inventory", icon: Warehouse, key: "inventory" },
  { to: "/admin/coupons", icon: Tag, key: "coupons" },
  { to: "/admin/reports", icon: BarChart3, key: "reports" },
  { to: "/admin/activity", icon: FileText, key: "activity" },
  { to: "/admin/settings", icon: Settings, key: "settings" },
];

export default function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {t(`adminPanel.nav.${item.key}`)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
