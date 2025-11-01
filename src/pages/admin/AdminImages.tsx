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
        title: "Error",
        description: "Failed to load images",
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
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await imagesAPI.delete(id);
      await logActivity("DELETE", "PRODUCT", undefined, `Deleted image ID: ${id}`);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.imageUrl) {
      toast({
        title: "Error",
        description: "Product ID and Image URL are required",
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
        title: "Success",
        description: "Image created successfully",
      });
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create image",
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
    return product?.productName || `Product #${productId}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Images</h1>
            <p className="text-muted-foreground mt-1">Manage product and variant images</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Image</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product *</Label>
                  <select
                    id="productId"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variantId">Variant ID (Optional)</Label>
                  <Input
                    id="variantId"
                    type="number"
                    value={formData.variantId}
                    onChange={(e) =>
                      setFormData({ ...formData, variantId: e.target.value })
                    }
                    placeholder="Variant ID"
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
                  <Label htmlFor="isPrimary">Set as Primary Image</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name or image URL..."
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
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading images...
                  </TableCell>
                </TableRow>
              ) : filteredImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground">
                          No images found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add images to products to display them in the store
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
                          Primary
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

