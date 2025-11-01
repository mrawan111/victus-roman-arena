import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { variantsAPI, productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminInventory() {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const variantsData = await variantsAPI.getAll();
      // Fetch products to get names
      const productsData = await productsAPI.getAll(0, 1000);
      const productsMap = new Map(
        productsData.content.map((p: any) => [p.productId, p])
      );

      const variantsWithProducts = variantsData.map((variant: any) => ({
        ...variant,
        product: productsMap.get(variant.productId),
      }));

      setVariants(variantsWithProducts);
    } catch (error: any) {
      console.error("Error loading inventory:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVariants = variants.filter(
    (variant) =>
      variant.product?.productName?.toLowerCase().includes(search.toLowerCase()) ||
      variant.color?.toLowerCase().includes(search.toLowerCase()) ||
      variant.size?.toLowerCase().includes(search.toLowerCase()) ||
      variant.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockVariants = filteredVariants.filter(
    (v) => v.stockQuantity < 10
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Inventory</h1>
            <p className="text-muted-foreground mt-1">Track stock levels and manage inventory</p>
          </div>
          {lowStockVariants.length > 0 && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {lowStockVariants.length} Low Stock Item{lowStockVariants.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product, color, size, or SKU..."
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
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Stock Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : filteredVariants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No inventory items found
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {variant.product?.productName || "Unknown Product"}
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
                        {variant.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
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
