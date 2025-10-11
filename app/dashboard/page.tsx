import { getSession } from "@/actions/session";
import { getBestSellerProducts, getVendorMetrics, getVendorProductCount, getVendorSaleCount } from "@/actions/vendors/analytics";
import { getVendorById } from "@/actions/vendors/vendors";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area";
import { ChartBarDefault } from "@/components/dashboard/chart-bar";
import { BestSellerGraph } from "@/components/dashboard/chart-radar";
import BusinessHeader from "@/components/dashboard/dashboad-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  ClipboardCheck,
  CloudSun,
  Container,
  DollarSign,
  Package,
  ShoppingBasket,
  Store
} from "lucide-react";
import Link from "next/link";
export default async function AdminDashboard() {

  const { user } = await getSession();
  const resp = await getVendorById(user?.id);
  const actions = [
    { label: "View Orders", href: "#", icon: <Package className="w-5 h-5 text-foreground" /> },
    { label: "Check Frame", href: "/dashboard/products/frames", icon: <Container className="w-5 h-5 text-foreground" /> },
    { label: "Check Reader Glass", href: "/dashboard/products/readers", icon: <BookOpen className="w-5 h-5 text-foreground" /> },
    { label: "Check Sunglasses", href: "/dashboard/products/sunglasses", icon: <CloudSun className="w-5 h-5 text-foreground" /> },
  ]

  const [productCount, salesCount, metrics, bestSeller] = await Promise.all([getVendorProductCount(), getVendorSaleCount(), getVendorMetrics(), getBestSellerProducts(user?.id, 1, 10)])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="h-full bg-background">
        <BusinessHeader resp={resp?.data} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader> Quick Actions </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {actions.map((action) => (
              <div className="bg-card rounded-lg p-8 border border-border/50">
                <Link key={action.label} href={action.href} aria-label={action.label} className="group block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      {action.icon}
                    </div>
                    <h3 className="text-xl font-medium text-foreground">{action.label}</h3>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">{"Tap to continue"}</div>
                </Link>
              </div>
            ))}
          </div>


          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Time Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{metrics.total_sales}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.total_orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"> {metrics.pending_orders} </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
                <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"> {metrics.total_items_sold} </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>



      <div>
        <ChartAreaInteractive salesCount={salesCount?.data} />
      </div>
      <div className="flex justify-between w-full gap-4 flex-col md:flex-row">
        <BestSellerGraph data={bestSeller.data} />
        <ChartBarDefault data={productCount?.data} />
      </div>

    </div>
  );
}
