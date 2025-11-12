import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Image as ImageIcon, Package, Trash2 } from "lucide-react";
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
import { imagesAPI, productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activityLogger";
import { useTranslation } from "react-i18next";

export default function AdminImages() {
  const [images, setImages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    variantId: "",
    imageUrl: "",
    isPrimary: false,
  });
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [imagesData, productsData] = await Promise.all([
        imagesAPI.getAll().catch(() => []),
        productsAPI.getAll(0, 1000).catch(() => ({ content: [] })),
      ]);

      setImages(imagesData || []);
      setProducts(productsData.content || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: t("common.error"),
        description: t("adminPanel.images.toast.loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      productId: "",
      variantId: "",
      imageUrl: "",
      isPrimary: false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("adminPanel.images.confirmDelete"))) return;

    try {
      await imagesAPI.delete(id);
      await logActivity("DELETE", "PRODUCT", undefined, `Deleted image ID: ${id}`);
      toast({
        title: t("common.success"),
        description: t("adminPanel.images.toast.deleteSuccess"),
      });
      loadData();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.images.toast.deleteError"),
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.imageUrl) {
      toast({
        title: t("common.error"),
        description: t("adminPanel.images.toast.missingFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      const created = await imagesAPI.create({
        productId: parseInt(formData.productId),
        variantId: formData.variantId ? parseInt(formData.variantId) : undefined,
        imageUrl: formData.imageUrl,
        isPrimary: formData.isPrimary,
      });
      await logActivity("CREATE", "PRODUCT", parseInt(formData.productId), `Added image to product ID: ${formData.productId}`);
      toast({
        title: t("common.success"),
        description: t("adminPanel.images.toast.createSuccess"),
      });
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.images.toast.createError"),
        variant: "destructive",
      });
    }
  };

  const filteredImages = images.filter((image) => {
    const product = products.find((p) => p.productId === image.productId);
    return (
      product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
      image.imageUrl?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.productId === productId);
    return product?.productName || t("adminPanel.images.productFallback", { id: productId });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">{t("adminPanel.images.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("adminPanel.images.subtitle")}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t("adminPanel.images.addButton")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("adminPanel.images.dialog.title")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">{t("adminPanel.images.dialog.fields.product.label")}</Label>
                  <select
                    id="productId"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">{t("adminPanel.images.dialog.fields.product.placeholder")}</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">{t("adminPanel.images.dialog.fields.imageUrl.label")}</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder={t("adminPanel.images.dialog.fields.imageUrl.placeholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variantId">{t("adminPanel.images.dialog.fields.variantId.label")}</Label>
                  <Input
                    id="variantId"
                    type="number"
                    value={formData.variantId}
                    onChange={(e) =>
                      setFormData({ ...formData, variantId: e.target.value })
                    }
                    placeholder={t("adminPanel.images.dialog.fields.variantId.placeholder")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={formData.isPrimary}
                    onChange={(e) =>
                      setFormData({ ...formData, isPrimary: e.target.checked })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="isPrimary">{t("adminPanel.images.dialog.fields.primary.label")}</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t("adminPanel.images.dialog.cancel")}
                  </Button>
                  <Button type="submit">{t("adminPanel.images.dialog.create")}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("adminPanel.images.searchPlaceholder")}
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
                <TableHead>{t("adminPanel.images.table.columns.image")}</TableHead>
                <TableHead>{t("adminPanel.images.table.columns.product")}</TableHead>
                <TableHead>{t("adminPanel.images.table.columns.variant")}</TableHead>
                <TableHead>{t("adminPanel.images.table.columns.url")}</TableHead>
                <TableHead>{t("adminPanel.images.table.columns.primary")}</TableHead>
                <TableHead>{t("adminPanel.images.table.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("adminPanel.images.table.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground">
                          {t("adminPanel.images.table.emptyTitle")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("adminPanel.images.table.emptySubtitle")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredImages.map((image) => (
                  <TableRow key={image.imageId}>
                    <TableCell>
                      <img
                        src={image.imageUrl}
                        alt="Product image"
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {getProductName(image.productId)}
                      </div>
                    </TableCell>
                    <TableCell>{image.variantId || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a
                        href={image.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {image.imageUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      {image.isPrimary ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {t("adminPanel.images.table.primary")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(image.imageId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

