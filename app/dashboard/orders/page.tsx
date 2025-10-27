import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/order";
import { searchOrders } from "@/actions/orders";
import { OrderTableActions } from "@/components/orders/OrderTableActions";
import { OrderSearchFilter } from "@/components/orders/OrderSearchFilter";
import { Pagination } from "@/components/dashboard/Pagination";
import { ShoppingCart, Package, CheckCircle, Clock, IndianRupee } from "lucide-react";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    vendorId?: string;
    userId?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const sp = await searchParams;
  const page = sp.page || "1";
  const limit = sp.limit || "30";
  const searchTerm = sp.searchTerm || "";
  const status = sp.status && sp.status !== "all" ? sp.status : "";
  const startDate = sp.startDate || "";
  const endDate = sp.endDate || "";
  const vendorId = sp.vendorId || "";
  const userId = sp.userId || "";

  const ordersData = await searchOrders({
    page,
    limit,
    searchTerm,
    status,
    startDate,
    endDate,
    vendorId,
    userId,
  });

  const { pagination } = ordersData.data;
  const orders = ordersData.data.orders;

  // Calculate stats
  const totalOrders = pagination.totalCount;
  const deliveredOrders = orders.filter((o: Order) => o.order_status === "delivered").length;
  const pendingOrders = orders.filter(
    (o: Order) => o.order_status === "pending" || o.order_status === "processing"
  ).length;
  const cancelledOrders = orders.filter((o: Order) => o.order_status === "cancelled").length;
  const totalRevenue = orders
    .filter((o: Order) => o.order_status === "delivered")
    .reduce((sum: number, o: Order) => sum + o.total_amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "default";
      case "processing":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount || isNaN(amount)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and monitor all customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending/Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From delivered orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <OrderSearchFilter />

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Order Code</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {searchTerm || status || startDate || endDate
                            ? "No orders found matching your filters"
                            : "No orders found"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: Order) => (
                    <TableRow key={order._id} className="hover:bg-muted/50">
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {order.orderCode}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {order.items.map((item) => item.productName).join(", ")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{order.shipping_address.phone}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {order.shipping_address.city}, {order.shipping_address.state}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(order.createdAt)}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusColor(order.order_status)} className="capitalize">
                          {order.order_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.tracking_id ? (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {order.tracking_id}
                          </code>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <OrderTableActions order={order} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        page={pagination.page}
        totalPages={pagination.pages}
        totalItems={pagination.totalCount}
        itemLabel="order"
        useUrlNavigation={true}
      />
    </div>
  );
}
