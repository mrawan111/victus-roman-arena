import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Store, Star, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { sellersAPI } from "@/lib/api";
import { useTranslation } from "react-i18next";

export default function AdminSellers() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const data = await sellersAPI.getAll();
      setSellers(data || []);
    } catch (error: any) {
      console.error("Error loading sellers:", error);
      toast({
        title: t("common.error"),
        description: error.message || t("adminPanel.sellers.table.loading"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
      seller.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-bold">{t("adminPanel.sellers.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("adminPanel.sellers.subtitle")}</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("adminPanel.sellers.addButton")}
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("adminPanel.sellers.searchPlaceholder")}
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
                <TableHead>{t("adminPanel.sellers.table.columns.seller")}</TableHead>
                <TableHead>{t("adminPanel.sellers.table.columns.email")}</TableHead>
                <TableHead>{t("adminPanel.sellers.table.columns.rating")}</TableHead>
                <TableHead>{t("adminPanel.sellers.table.columns.status")}</TableHead>
                <TableHead>{t("adminPanel.sellers.table.columns.created")}</TableHead>
                <TableHead>{t("adminPanel.sellers.table.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {t("adminPanel.sellers.table.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredSellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <Store className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground">
                          {t("adminPanel.sellers.table.emptyTitle")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("adminPanel.sellers.table.emptySubtitle")}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSellers.map((seller) => (
                  <TableRow key={seller.sellerId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {seller.sellerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {seller.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{seller.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          seller.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.isActive !== false ? t("adminPanel.sellers.status.active") : t("adminPanel.sellers.status.inactive")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {seller.createdAt
                        ? new Date(seller.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        {t("adminPanel.sellers.buttons.view")}
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

