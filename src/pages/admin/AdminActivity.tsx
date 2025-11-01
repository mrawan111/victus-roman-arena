import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, User, Activity, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { activityAPI } from "@/lib/api";

export default function AdminActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterType, setFilterType] = useState<"all" | "admin" | "entity" | "action">("all");
  const [filterValue, setFilterValue] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadActivity();
  }, [page, filterType, filterValue, selectedEntityType, selectedActionType]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      let response;

      if (filterType === "admin" && filterValue) {
        response = await activityAPI.getByAdminEmail(filterValue, page, size);
      } else if (filterType === "entity" && selectedEntityType) {
        const data = await activityAPI.getByEntityType(selectedEntityType);
        // For entity/action filters, we don't have pagination, so we'll paginate manually
        const start = page * size;
        const end = start + size;
        response = {
          content: data.slice(start, end),
          totalElements: data.length,
          totalPages: Math.ceil(data.length / size),
          size,
          number: page,
        };
      } else if (filterType === "action" && selectedActionType) {
        const data = await activityAPI.getByActionType(selectedActionType);
        const start = page * size;
        const end = start + size;
        response = {
          content: data.slice(start, end),
          totalElements: data.length,
          totalPages: Math.ceil(data.length / size),
          size,
          number: page,
        };
      } else {
        response = await activityAPI.getAll(page, size);
      }

      setActivities(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error: any) {
      console.error("Error loading activity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    const colors: Record<string, string> = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      VIEW: "bg-gray-100 text-gray-800",
      LOGIN: "bg-purple-100 text-purple-800",
      LOGOUT: "bg-orange-100 text-orange-800",
    };
    return colors[actionType] || "bg-gray-100 text-gray-800";
  };

  const entityTypes = ["PRODUCT", "ORDER", "COUPON", "USER", "CATEGORY", "SELLER", "CART", "SYSTEM"];
  const actionTypes = ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT", "APPROVE", "REJECT"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Activity Logs</h1>
          <p className="text-muted-foreground mt-1">Track admin actions and system events</p>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Filter By</label>
              <Select
                value={filterType}
                onValueChange={(value: "all" | "admin" | "entity" | "action") => {
                  setFilterType(value);
                  setPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="admin">By Admin Email</SelectItem>
                  <SelectItem value="entity">By Entity Type</SelectItem>
                  <SelectItem value="action">By Action Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "admin" && (
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Admin Email</label>
                <Input
                  placeholder="admin@example.com"
                  value={filterValue}
                  onChange={(e) => {
                    setFilterValue(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            )}

            {filterType === "entity" && (
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Entity Type</label>
                <Select
                  value={selectedEntityType}
                  onValueChange={(value) => {
                    setSelectedEntityType(value);
                    setPage(0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "action" && (
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <Select
                  value={selectedActionType}
                  onValueChange={(value) => {
                    setSelectedActionType(value);
                    setPage(0);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(filterType === "admin" || filterType === "entity" || filterType === "action") && (
              <Button
                variant="outline"
                onClick={() => {
                  setFilterType("all");
                  setFilterValue("");
                  setSelectedEntityType("");
                  setSelectedActionType("");
                  setPage(0);
                }}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {activities.length} of {totalElements} activities
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {page + 1} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading activity logs...
                  </TableCell>
                </TableRow>
              ) : activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <Activity className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-semibold text-muted-foreground">
                          No activity logs found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Activity logs will appear here once actions are performed
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.activityId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          {activity.createdAt
                            ? new Date(activity.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {activity.adminEmail || "System"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getActionBadgeColor(activity.actionType)}`}>
                        {activity.actionType}
                      </span>
                    </TableCell>
                    <TableCell>{activity.entityType}</TableCell>
                    <TableCell>{activity.entityId || "-"}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={activity.description}>
                        {activity.description || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {activity.ipAddress || "-"}
                      </span>
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
