import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminCustomers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage customer information</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Customer management coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
