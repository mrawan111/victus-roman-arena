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
  Warehouse
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/inventory", icon: Warehouse, label: "Inventory" },
  { to: "/admin/coupons", icon: Tag, label: "Coupons" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/activity", icon: FileText, label: "Activity Logs" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
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
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
