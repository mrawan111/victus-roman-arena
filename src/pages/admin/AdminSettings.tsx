import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure store settings and preferences</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Settings coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
