import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package, Edit, Trash2 } from "lucide-react";
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
import { variantsAPI, productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function AdminVariants() {
  const [variants, setVariants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [formData, setFormData] = useState({
    productId: "",
    color: "",
    size: "",
    stockQuantity: "0",
    price: "0",
    sku: "",
    isActive: true,
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [variantsData, productsData] = await Promise.all([
        variantsAPI.getAll().catch(() => []),
        productsAPI.getAll(0, 1000).catch(() => ({ content: [] })),
      ]);

      setVariants(variantsData || []);
      setProducts(productsData.content || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: t("common.error"),
        description: t("adminPanel.variants.toast.loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVariant(null);
    setFormData({
      productId: "",
      color: "",
      size: "",
      stockQuantity: "0",
      price: "0",
      sku: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (variant: any) => {
    setEditingVariant(variant);
    setFormData({
      productId: variant.productId?.toString() || "",
      color: variant.color || "",
      size: variant.size || "",
      stockQuantity: variant.stockQuantity?.toString() || "0",
      price: variant.price?.toString() || "0",
      sku: variant.sku || "",
      isActive: variant.isActive !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("adminPanel.variants.confirmDelete"))) return;

    try {
      await variantsAPI.delete(id);
      toast({
        title: t("common.success"),
        description: t("adminPanel.variants.toast.deleteSuccess"),
      });
      loadData();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.variants.toast.deleteError"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        productId: parseInt(formData.productId),
        color: formData.color || undefined,
        size: formData.size || undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        price: parseFloat(formData.price),
        sku: formData.sku || undefined,
        isActive: formData.isActive,
      };

      if (editingVariant) {
        await variantsAPI.update(editingVariant.variantId, data);
        toast({
          title: t("common.success"),
          description: t("adminPanel.variants.toast.updateSuccess"),
        });
      } else {
        await variantsAPI.create(data);
        toast({
          title: t("common.success"),
          description: t("adminPanel.variants.toast.createSuccess"),
        });
      }

      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.variants.toast.saveError"),
        variant: "destructive",
      });
    }
  };

  const filteredVariants = variants.filter((variant) => {
    const product = products.find((p) => p.productId === variant.productId);
    return (
      product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
      variant.color?.toLowerCase().includes(search.toLowerCase()) ||
      variant.size?.toLowerCase().includes(search.toLowerCase()) ||
      variant.sku?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.productId === productId);
    return product?.productName || t("adminPanel.variants.productFallback", { id: productId });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">{t("adminPanel.variants.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("adminPanel.variants.subtitle")}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t("adminPanel.variants.addButton")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingVariant
                    ? t("adminPanel.variants.dialog.editTitle")
                    : t("adminPanel.variants.dialog.createTitle")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">{t("adminPanel.variants.dialog.fields.product.label")}</Label>
                  <select
                    id="productId"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">{t("adminPanel.variants.dialog.fields.product.placeholder")}</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">{t("adminPanel.variants.dialog.fields.color.label")}</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder={t("adminPanel.variants.dialog.fields.color.placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">{t("adminPanel.variants.dialog.fields.size.label")}</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      placeholder={t("adminPanel.variants.dialog.fields.size.placeholder")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">{t("adminPanel.variants.dialog.fields.stock.label")}</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) =>
                        setFormData({ ...formData, stockQuantity: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t("adminPanel.variants.dialog.fields.price.label")}</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">{t("adminPanel.variants.dialog.fields.sku.label")}</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder={t("adminPanel.variants.dialog.fields.sku.placeholder")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isActive">{t("adminPanel.variants.dialog.fields.active.label")}</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t("adminPanel.variants.dialog.cancel")}
                  </Button>
                  <Button type="submit">
                    {editingVariant
                      ? t("adminPanel.variants.dialog.update")
                      : t("adminPanel.variants.dialog.create")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("adminPanel.variants.searchPlaceholder")}
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
                <TableHead>{t("adminPanel.variants.table.columns.product")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.variant")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.sku")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.stock")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.price")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.status")}</TableHead>
                <TableHead>{t("adminPanel.variants.table.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t("adminPanel.variants.table.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredVariants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {t("adminPanel.variants.table.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVariants.map((variant) => (
                  <TableRow
                    key={variant.variantId}
                    className={
                      variant.stockQuantity < 10 ? "bg-red-50" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {getProductName(variant.productId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {variant.color && variant.size
                        ? `${variant.color} / ${variant.size}`
                        : variant.color || variant.size || "-"}
                    </TableCell>
                    <TableCell>{variant.sku || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={
                          variant.stockQuantity < 10
                            ? "font-semibold text-red-600"
                            : ""
                        }
                      >
                        {variant.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell>${variant.price?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          variant.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {variant.isActive !== false
                          ? t("adminPanel.variants.status.active")
                          : t("adminPanel.variants.status.inactive")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(variant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(variant.variantId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}

