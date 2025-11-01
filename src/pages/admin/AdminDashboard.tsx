import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ordersAPI, productsAPI, variantsAPI } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        ordersAPI.getAll().catch(() => []),
        productsAPI.getAll(0, 100).catch(() => ({ content: [], totalElements: 0 })),
      ]);

      const orders = Array.isArray(ordersRes) ? ordersRes : [];
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.totalPrice || 0), 0);
      const totalProducts = productsRes.totalElements || productsRes.content?.length || 0;

      // Check for low stock variants
      let lowStockCount = 0;
      try {
        const variants = await variantsAPI.getAll();
        lowStockCount = variants.filter((v: any) => v.stockQuantity < 10).length;
      } catch {
        // Variants check failed, use 0
      }

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        lowStockProducts: lowStockCount,
        totalProducts,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Low Stock Alerts",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Victus Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your martial arts equipment store with comprehensive tools for products, orders,
              inventory, customers, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
