import { getSession } from "@/actions/session";
import {
  getBestSellerProducts,
  getVendorMetrics,
  getVendorProductCount,
  getVendorSaleCount,
} from "@/actions/vendors/analytics";
import { getVendorById } from "@/actions/vendors/vendors";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import { ChartBarDefault } from "@/components/dashboard/chart-bar";
import { BestSellerGraph } from "@/components/dashboard/chart-radar";
import BusinessHeader from "@/components/dashboard/dashboad-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  CloudSun,
  Container,
  DollarSign,
  Package,
  ShoppingBasket,
  Store,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const { user } = await getSession();
  const resp = await getVendorById(user?.id);
  const actions = [
    {
      label: "View Orders",
      href: "/dashboard/orders",
      icon: Package,
      description: "Manage all orders",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
    },
    {
      label: "Frames",
      href: "/dashboard/products/frames",
      icon: Container,
      description: "Manage frames inventory",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20",
    },
    {
      label: "Readers",
      href: "/dashboard/products/readers",
      icon: BookOpen,
      description: "Manage reading glasses",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
    },
    {
      label: "Sunglasses",
      href: "/dashboard/products/sunglasses",
      icon: CloudSun,
      description: "Manage sunglasses collection",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
    },
  ];

  const [productCount, salesCount, metrics, bestSeller] = await Promise.all([
    getVendorProductCount(),
    getVendorSaleCount(),
    getVendorMetrics(),
    getBestSellerProducts(user?.id, 1, 10),
  ]);

  return (
    <div className="space-y-8 pb-8">
      {/* Modern Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-border/50">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <BusinessHeader resp={resp?.data} />
      </div>

      {/* Stats Overview - Moved Up */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Time Sales</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              ₹{metrics.total_sales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Total revenue generated
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Store className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {metrics.total_orders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Orders processed
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ClipboardCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {metrics.pending_orders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              {metrics.pending_orders > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-amber-600" />
                  Requires attention
                </>
              ) : (
                <>
                  <Activity className="h-3 w-3" />
                  All caught up
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ShoppingBasket className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {metrics.total_items_sold.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Products moved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Modernized */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Quick Actions</CardTitle>
              <CardDescription className="mt-1">Access frequently used features</CardDescription>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {actions.length} shortcuts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group relative overflow-hidden rounded-lg border border-border/50 p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <div className="relative z-10">
                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 ${action.color}`}
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                    Go now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="space-y-6">
        <div>
          <ChartAreaInteractive salesCount={salesCount?.data} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BestSellerGraph data={bestSeller.data} />
          <ChartBarDefault data={productCount?.data} />
        </div>
      </div>
    </div>
  );
}
