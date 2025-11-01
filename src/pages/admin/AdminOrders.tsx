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

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { toast } = useToast();

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
        title: "Error",
        description: "Failed to load orders",
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
        title: "Status Updated",
        description: "Order status has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
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
    return <Badge variant={variants[status?.toLowerCase()] || "default"}>{status || "pending"}</Badge>;
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
            <h1 className="text-3xl font-display font-bold">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{orders.length}</span>
            <span className="text-muted-foreground">Total Orders</span>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders yet
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
                        View
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
            <DialogTitle>Order Details - #{selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.phoneNum || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <p className="text-sm"><span className="font-medium">Date:</span> {new Date(selectedOrder.orderDate || selectedOrder.createdAt || Date.now()).toLocaleString()}</p>
                  <p className="text-sm"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod || "-"}</p>
                  <p className="text-sm"><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus || "-"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm">{selectedOrder.address || "-"}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                {selectedOrder.orderItems ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
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
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Order items details are not available in this view.</p>
                    <p className="text-xs mt-1">The order items are not embedded in the current API response.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Status:</span>
                    <Select
                      value={selectedOrder.orderStatus || "pending"}
                      onValueChange={(value) => handleStatusUpdate(selectedOrder.orderId, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold mt-2">Total: ${Number(selectedOrder.totalPrice || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
