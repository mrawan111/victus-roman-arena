import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Folder, Edit, Trash2 } from "lucide-react";
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
import { categoriesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/activityLogger";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: "",
    parentCategoryId: "",
    isActive: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: "",
      categoryImage: "",
      parentCategoryId: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName || "",
      categoryImage: category.categoryImage || "",
      parentCategoryId: category.parentCategoryId?.toString() || "",
      isActive: category.isActive !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const category = categories.find((c) => c.categoryId === id);
    if (!confirm(`Are you sure you want to delete category "${category?.categoryName}"?`)) return;

    try {
      await categoriesAPI.delete(id);
      await logActivity("DELETE", "CATEGORY", id, `Deleted category: ${category?.categoryName}`);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.categoryId, {
          categoryName: formData.categoryName,
          categoryImage: formData.categoryImage || undefined,
          isActive: formData.isActive,
        });
        await logActivity("UPDATE", "CATEGORY", editingCategory.categoryId, `Updated category: ${formData.categoryName}`);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const created = await categoriesAPI.create({
          categoryName: formData.categoryName,
          categoryImage: formData.categoryImage || undefined,
          parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : undefined,
          isActive: formData.isActive,
        });
        await logActivity("CREATE", "CATEGORY", created.categoryId, `Created category: ${formData.categoryName}`);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      setIsDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (id: number | undefined) => {
    if (!id) return null;
    const category = categories.find((c) => c.categoryId === id);
    return category?.categoryName || null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage product categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Create Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name *</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryImage">Category Image URL</Label>
                  <Input
                    id="categoryImage"
                    value={formData.categoryImage}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentCategoryId">Parent Category</Label>
                  <select
                    id="parentCategoryId"
                    value={formData.parentCategoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, parentCategoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">None</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
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
                  <Button type="submit">
                    {editingCategory ? "Update" : "Create"}
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
              placeholder="Search categories..."
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
                <TableHead>Category</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        {category.categoryName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryName(category.parentCategoryId) || "-"}
                    </TableCell>
                    <TableCell>
                      {category.categoryImage ? (
                        <img
                          src={category.categoryImage}
                          alt={category.categoryName}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          category.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.categoryId)}
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

