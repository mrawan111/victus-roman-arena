import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminCoupons() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Coupons & Promotions</h1>
          <p className="text-muted-foreground mt-1">Create and manage discount codes</p>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground">Coupon management coming soon...</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
