import { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productsAPI, categoriesAPI, sellersAPI, variantsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activityLogger";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      basePrice: "",
      categoryId: "",
      sellerId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSellers();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  const loadSellers = async () => {
    try {
      const data = await sellersAPI.getAll();
      setSellers(data || []);
    } catch (error: any) {
      console.error("Error loading sellers:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll(0, 100);
      setProducts(response.content || []);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast({
        title: t("common.error"),
        description: t("adminPanel.products.toast.loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product: any) =>
        product.productName?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.categoryName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);



  const handleCreateProduct = async (data: any) => {
    try {
      const productData = {
        productName: data.productName,
        description: data.description || undefined,
        basePrice: parseFloat(data.basePrice),
        categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
        sellerId: data.sellerId ? parseInt(data.sellerId) : undefined,
        isActive: data.isActive,
      };

      const createdProduct = await productsAPI.create(productData);

      await logActivity("CREATE", "PRODUCT", createdProduct.productId, `Created product: ${data.productName}`);

      toast({
        title: t("common.success"),
        description: t("adminPanel.products.toast.createSuccess"),
      });

      setIsDialogOpen(false);
      form.reset();
      loadProducts();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.products.toast.createError"),
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = () => {
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">{t("adminPanel.products.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("adminPanel.products.subtitle")}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <Plus className="mr-2 h-4 w-4" />
                {t("adminPanel.products.addButton")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("adminPanel.products.dialog.title")}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="productName"
                      rules={{ required: t("adminPanel.products.dialog.fields.name.required") }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("adminPanel.products.dialog.fields.name.label")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("adminPanel.products.dialog.fields.name.placeholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="basePrice"
                      rules={{
                        required: t("adminPanel.products.dialog.fields.price.required"),
                        min: { value: 0, message: t("adminPanel.products.dialog.fields.price.min") },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("adminPanel.products.dialog.fields.price.label")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder={t("adminPanel.products.dialog.fields.price.placeholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t("adminPanel.products.dialog.fields.description.label")}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t("adminPanel.products.dialog.fields.description.placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("adminPanel.products.dialog.fields.category.label")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("adminPanel.products.dialog.fields.category.placeholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                  {category.categoryName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sellerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("adminPanel.products.dialog.fields.seller.label")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("adminPanel.products.dialog.fields.seller.placeholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sellers.map((seller: any) => (
                                <SelectItem key={seller.sellerId} value={seller.sellerId.toString()}>
                                  {seller.sellerName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">{t("adminPanel.products.dialog.fields.active.label")}</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            {t("adminPanel.products.dialog.fields.active.help")}
                          </div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />



                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      {t("adminPanel.products.dialog.cancel")}
                    </Button>
                    <Button type="submit">{t("adminPanel.products.dialog.submit")}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("adminPanel.products.searchPlaceholder")}
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
                <TableHead>{t("adminPanel.products.table.columns.product")}</TableHead>
                <TableHead>{t("adminPanel.products.table.columns.category")}</TableHead>
                <TableHead>{t("adminPanel.products.table.columns.price")}</TableHead>
                <TableHead>{t("adminPanel.products.table.columns.stock")}</TableHead>
                <TableHead>{t("adminPanel.products.table.columns.status")}</TableHead>
                <TableHead>{t("adminPanel.products.table.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("adminPanel.products.table.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("adminPanel.products.table.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.category?.categoryName || t("adminPanel.products.status.uncategorized")}</TableCell>
                    <TableCell>${product.basePrice?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive !== false
                          ? t("adminPanel.products.status.active")
                          : t("adminPanel.products.status.inactive")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        {t("adminPanel.products.edit")}
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
