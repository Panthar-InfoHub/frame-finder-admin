import { getSunglassById, deleteSunglassAction } from "@/actions/vendors/products";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Package, Star, Ruler } from "lucide-react";
import Link from "next/link";
import { SunglassVariantStock } from "@/components/products/sunglasses/VariantStockDialog";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import Image from "next/image";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { variant?: string };
}) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SunglassesDetails id={id} searchParams={searchParams} />
    </Suspense>
  );
};

const SunglassesDetails = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { variant?: string };
}) => {
  const resp = await getSunglassById(id);
  if (!resp.success) {
    return <div>Unable to fetch the details</div>;
  }

  const data = resp?.data;

  const selectedVariantId = (await searchParams)?.variant;
  const selectedVariant = selectedVariantId
    ? data?.variants?.find((variant: any) => variant._id === selectedVariantId) ||
      data?.variants?.[0]
    : data?.variants?.[0];

  if (!data) {
    return <div className="p-4">No product data available</div>;
  }

  return (
    <section className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <BackButton href="/dashboard/products/sunglasses" className="mb-4">
          Back to Sunglasses
        </BackButton>

        {/* Product Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data?.brand_name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{data?.rating}</span>
              </div>
              <Badge variant={data?.status === "active" ? "default" : "secondary"}>
                {data?.status}
              </Badge>
              {data?.is_power && <Badge variant="outline">Power Lens</Badge>}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/products/sunglasses/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <DeleteDialog
              productId={id}
              deleteProductFunc={deleteSunglassAction}
              redirectUrl="/dashboard/products/sunglasses"
            />

            <SunglassVariantStock product={data}>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Update Stock
              </Button>
            </SunglassVariantStock>
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
                <p className="font-medium">{data?.productCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{data?.material?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shape</p>
                <p className="font-medium">{data?.shape?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Style</p>
                <p className="font-medium">{data?.style?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{data?.gender?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sizes</p>
                <p className="font-medium">{data?.sizes?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">HSN Code</p>
                <p className="font-medium">{data?.hsn_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frame Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Frame Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Width</p>
                <p className="font-medium">{data?.dimension?.lens_width} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bridge Width</p>
                <p className="font-medium">{data?.dimension?.bridge_width} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temple Length</p>
                <p className="font-medium">{data?.dimension?.temple_length} mm</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Height</p>
                <p className="font-medium">{data?.dimension?.lens_height} mm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Variants ({data?.variants?.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {data?.variants?.map((variant: any, index: number) => (
                <form key={variant._id} method="GET">
                  <input type="hidden" name="variant" value={variant._id} />
                  <Button
                    type="submit"
                    variant={selectedVariant?._id === variant._id ? "default" : "outline"}
                    className="h-auto py-2"
                  >
                    Variant {index + 1}
                  </Button>
                </form>
              ))}
            </div>

            {/* Selected Variant Details */}
            {selectedVariant && (
              <div className="space-y-6">
                {/* Images Gallery */}
                {selectedVariant?.images && selectedVariant.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedVariant.images.map(async (img: any, imgIndex: number) => {
                      const imageUrl = await getSignedViewUrl(img.url);
                      return (
                        <div
                          key={imgIndex}
                          className="relative aspect-square rounded-lg overflow-hidden border"
                        >
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`${data?.brand_name} - Image ${imgIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Variant Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Frame Color</p>
                    <Badge variant="outline" className="text-sm">
                      {selectedVariant?.frame_color}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Temple Color</p>
                    <Badge variant="outline" className="text-sm">
                      {selectedVariant?.temple_color}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lens Color</p>
                    <Badge variant="secondary" className="text-sm">
                      {selectedVariant?.lens_color}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="text-xl font-bold">₹{selectedVariant?.price?.base_price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">MRP</p>
                    <p className="text-xl font-semibold">₹{selectedVariant?.price?.mrp}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Shipping Price</p>
                    <p className="font-medium">₹{selectedVariant?.price?.shipping_price?.value}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-medium">₹{selectedVariant?.price?.total_price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{selectedVariant?.stock?.current} units</p>
                      <Badge
                        variant={
                          selectedVariant?.stock?.current > selectedVariant?.stock?.minimum
                            ? "default"
                            : "destructive"
                        }
                      >
                        {selectedVariant?.stock?.current > selectedVariant?.stock?.minimum
                          ? "In Stock"
                          : "Low Stock"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum Stock</p>
                    <p className="font-medium">{selectedVariant?.stock?.minimum} units</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </section>
  );
};

export default page;
