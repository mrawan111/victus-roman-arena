import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminInventory() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track stock levels and manage inventory</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Inventory management coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
