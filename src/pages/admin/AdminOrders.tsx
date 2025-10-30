import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminOrders() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Orders management coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
