import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminActivity() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">View admin actions and system activity</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Activity logs coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
