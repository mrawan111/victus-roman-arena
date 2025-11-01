import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Tag, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { couponsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activityLogger";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    couponCode: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await couponsAPI.getAll();
      setCoupons(data || []);
    } catch (error: any) {
      console.error("Error loading coupons:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load coupons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = () => {
    setEditingCoupon(null);
    setFormData({
      couponCode: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      couponCode: coupon.couponCode || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "PERCENTAGE",
      discountValue: coupon.discountValue?.toString() || "",
      minPurchaseAmount: coupon.minPurchaseAmount?.toString() || "",
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split("T")[0] : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : "",
      isActive: coupon.isActive !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      await couponsAPI.delete(id);
      await logActivity("DELETE", "COUPON", id, `Deleted coupon: ${code}`);
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        couponCode: formData.couponCode.toUpperCase(),
        description: formData.description || undefined,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString(),
        isActive: formData.isActive,
      };

      if (editingCoupon) {
        const updated = await couponsAPI.update(editingCoupon.couponId, submitData);
        await logActivity("UPDATE", "COUPON", editingCoupon.couponId, `Updated coupon: ${formData.couponCode}`);
        toast({
          title: "Success",
          description: "Coupon updated successfully",
        });
      } else {
        const created = await couponsAPI.create(submitData);
        await logActivity("CREATE", "COUPON", created.couponId, `Created coupon: ${formData.couponCode}`);
        toast({
          title: "Success",
          description: "Coupon created successfully",
        });
      }
      setIsDialogOpen(false);
      loadCoupons();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save coupon",
        variant: "destructive",
      });
    }
  };

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.couponCode?.toLowerCase().includes(search.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Coupons & Promotions</h1>
            <p className="text-muted-foreground mt-1">Create and manage discount codes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="couponCode">Coupon Code *</Label>
                    <Input
                      id="couponCode"
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "PERCENTAGE" | "FIXED") =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="20% off on all items"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value *</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder={formData.discountType === "PERCENTAGE" ? "20" : "10.00"}
                      required
                    />
                  </div>
                  {formData.discountType === "PERCENTAGE" && (
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscountAmount">Max Discount ($)</Label>
                      <Input
                        id="maxDiscountAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        placeholder="100.00"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchaseAmount">Min Purchase ($)</Label>
                    <Input
                      id="minPurchaseAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                      placeholder="50.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      min="0"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validFrom">Valid From *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">{editingCoupon ? "Update" : "Create"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading coupons...
                  </TableCell>
                </TableRow>
              ) : filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <Tag className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground">
                          No coupons found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Create your first discount code to get started
                        </p>
                      </div>
                      <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Coupon
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                  const isValid = coupon.isActive && !isExpired;
                  return (
                    <TableRow key={coupon.couponId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {coupon.couponCode}
                        </div>
                      </TableCell>
                      <TableCell>{coupon.description || "-"}</TableCell>
                      <TableCell>
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `$${coupon.discountValue?.toFixed(2)}`}
                        {coupon.maxDiscountAmount && coupon.discountType === "PERCENTAGE" && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (max ${coupon.maxDiscountAmount})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(coupon.validFrom).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            to {new Date(coupon.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            isValid
                              ? "bg-green-100 text-green-800"
                              : isExpired
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(coupon.couponId, coupon.couponCode)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
