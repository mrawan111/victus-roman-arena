import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Sales analytics and reports</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Reports coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
