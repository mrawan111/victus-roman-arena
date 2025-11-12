import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Eye, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ordersAPI } from "@/lib/api";
import { logActivity } from "@/lib/activityLogger";
import { useTranslation } from "react-i18next";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getWithProducts();
      // Sort by creation date (newest first)
      const sortedOrders = (data || []).sort((a: any, b: any) =>
        new Date(b.orderDate || b.createdAt || 0).getTime() - new Date(a.orderDate || a.createdAt || 0).getTime()
      );
      setOrders(sortedOrders);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      toast({
        title: t("common.error"),
        description: t("adminPanel.orders.toast.loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleViewOrder = async (order: any) => {
    try {
      const orderDetails = await ordersAPI.getById(order.orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      setSelectedOrder(order);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await ordersAPI.update(orderId, { orderStatus: newStatus });
      await logActivity("UPDATE", "ORDER", orderId, `Updated order #${orderId} status to: ${newStatus}`);
      
      // Update local state
      const updatedOrders = orders.map((order: any) => 
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
      
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }

      toast({
        title: t("adminPanel.orders.statusToast.title"),
        description: t("adminPanel.orders.statusToast.desc"),
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: t("adminPanel.orders.statusToast.errorTitle"),
        description: t("adminPanel.orders.statusToast.errorDesc"),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    const labelMap: Record<string, string> = {
      pending: t("adminPanel.orders.statusOptions.pending"),
      processing: t("adminPanel.orders.statusOptions.processing"),
      shipped: t("adminPanel.orders.statusOptions.shipped"),
      delivered: t("adminPanel.orders.statusOptions.delivered"),
      cancelled: t("adminPanel.orders.statusOptions.cancelled"),
    };
    const lower = status?.toLowerCase() || "pending";
    return <Badge variant={variants[lower] || "default"}>{labelMap[lower] || labelMap.pending}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">{t("adminPanel.orders.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("adminPanel.orders.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{orders.length}</span>
            <span className="text-muted-foreground">{t("adminPanel.orders.total")}</span>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("adminPanel.orders.table.columns.order")}</TableHead>
                <TableHead>{t("adminPanel.orders.table.columns.customer")}</TableHead>
                <TableHead>{t("adminPanel.orders.table.columns.date")}</TableHead>
                <TableHead>{t("adminPanel.orders.table.columns.total")}</TableHead>
                <TableHead>{t("adminPanel.orders.table.columns.status")}</TableHead>
                <TableHead>{t("adminPanel.orders.table.columns.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("adminPanel.orders.table.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium">#{order.orderId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.email}</div>
                        <div className="text-sm text-muted-foreground">{order.phoneNum || "-"}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(order.totalPrice || 0).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("adminPanel.orders.buttons.view")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("adminPanel.orders.dialog.title", { id: selectedOrder?.orderId })}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t("adminPanel.orders.dialog.customerInfo")}</h3>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.phoneNum || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t("adminPanel.orders.dialog.orderInfo")}</h3>
                  <p className="text-sm"><span className="font-medium">{t("adminPanel.orders.dialog.fields.date")}</span> {new Date(selectedOrder.orderDate || selectedOrder.createdAt || Date.now()).toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">{t("adminPanel.orders.dialog.fields.paymentMethod")}</span> {selectedOrder.paymentMethod || "-"}</p>
                  <p className="text-sm"><span className="font-medium">{t("adminPanel.orders.dialog.fields.paymentStatus")}</span> {selectedOrder.paymentStatus || "-"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t("adminPanel.orders.dialog.shipping")}</h3>
                <p className="text-sm">{selectedOrder.address || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("adminPanel.orders.dialog.items")}</h3>
                {selectedOrder.orderItems ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("adminPanel.orders.dialog.fields.product") || "Product"}</TableHead>
                        <TableHead>{t("adminPanel.orders.dialog.fields.variant") || "Variant"}</TableHead>
                        <TableHead>{t("adminPanel.orders.dialog.fields.quantity")}</TableHead>
                        <TableHead>{t("adminPanel.orders.dialog.fields.price")}</TableHead>
                        <TableHead>{t("adminPanel.orders.dialog.fields.lineTotal")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderItems.length > 0 ? (
                        selectedOrder.orderItems.map((item: any, index: number) => {
                          // Use embedded product details from the API response
                          const productName = item.variant?.product?.productName || "Unknown Product";
                          const variantDetails = `${item.variant?.color || ""} ${item.variant?.size || ""}`.trim() || "Default";

                          return (
                            <TableRow key={item.id || index}>
                              <TableCell className="font-medium">{productName}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{variantDetails}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${Number(item.priceAtTime || 0).toFixed(2)}</TableCell>
                              <TableCell>${(Number(item.priceAtTime || 0) * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            {t("adminPanel.orders.table.empty")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t("adminPanel.orders.dialog.itemsEmptyTitle")}</p>
                    <p className="text-xs mt-1">{t("adminPanel.orders.dialog.itemsEmptySubtitle")}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{t("adminPanel.orders.dialog.fields.status")}</span>
                    <Select
                      value={selectedOrder.orderStatus || "pending"}
                      onValueChange={(value) => handleStatusUpdate(selectedOrder.orderId, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t("adminPanel.orders.statusOptions.pending")}</SelectItem>
                        <SelectItem value="processing">{t("adminPanel.orders.statusOptions.processing")}</SelectItem>
                        <SelectItem value="shipped">{t("adminPanel.orders.statusOptions.shipped")}</SelectItem>
                        <SelectItem value="delivered">{t("adminPanel.orders.statusOptions.delivered")}</SelectItem>
                        <SelectItem value="cancelled">{t("adminPanel.orders.statusOptions.cancelled")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold mt-2">{t("adminPanel.orders.dialog.fields.total")} ${Number(selectedOrder.totalPrice || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
