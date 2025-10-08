import { getAccessoryById, deleteAccessory } from "@/actions/vendors/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import { StockUpdateDialog } from "@/components/products/stockUpdateDialog";
import { Edit, Package, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AccessoriesDetails id={id} />
    </Suspense>
  );
};

const AccessoriesDetails = async ({ id }: { id: string }) => {
  let resp = await getAccessoryById(id);
  if (!resp.success) {
    return <div>Unable to fetch the Accessory details</div>;
  }

  resp = resp?.data;

  if (!resp) {
    return <div className="p-4">No product data available</div>;
  }

  return (
    <section className="min-h-screen bg-background w-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <BackButton href="/dashboard/products/accessories" className="mb-4">
          Back to Accessories
        </BackButton>

        {/* Product Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{resp?.brand_name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{resp?.rating}</span>
              </div>
              <Badge variant={resp?.status === "active" ? "default" : "secondary"}>
                {resp?.status}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/products/accessories/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <DeleteDialog
              productId={id}
              deleteProductFunc={deleteAccessory}
              redirectUrl="/dashboard/products/accessories"
            />

            <StockUpdateDialog
              productId={id}
              currentStock={resp?.stock?.current || 0}
              productType="accessories"
            >
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Update Stock
              </Button>
            </StockUpdateDialog>
          </div>
        </div>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Product Code</p>
                <p className="font-medium">{resp?.productCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{resp?.material?.join(", ") || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sizes</p>
                <p className="font-medium">{resp?.sizes?.join(", ") || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">HSN Code</p>
                <p className="font-medium">{resp?.hsn_code}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Country of Origin</p>
                <p className="font-medium">{resp?.origin_country || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        {(resp?.mfg_date || resp?.exp) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resp?.mfg_date && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                    <p className="font-medium">{new Date(resp.mfg_date).toLocaleDateString()}</p>
                  </div>
                )}
                {resp?.exp && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{new Date(resp.exp).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="font-medium text-xl">₹{resp?.price?.base_price}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">MRP</p>
                <p className="font-medium text-xl">₹{resp?.price?.mrp}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-medium text-xl">₹{resp?.price?.total_price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="font-medium text-xl">{resp?.stock?.current} units</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Minimum Stock</p>
                <p className="font-medium text-xl">{resp?.stock?.minimum} units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        {resp?.images && resp.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resp.images.map((image: { url: string }, index: number) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`${resp.brand_name} - Image ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default page;
