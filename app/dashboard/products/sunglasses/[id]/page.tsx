import { getSunglassById, deleteSunglassAction } from "@/actions/vendors/products";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Package, Star } from "lucide-react";
import Link from "next/link";
import { SunglassVariantStock } from "@/components/products/sunglasses/VariantStockDialog";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{data?.brand_name}</h1>

            <div className="flex space-x-2">
              <Badge variant="secondary">{data?.productCode}</Badge>
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

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{data?.rating}</span>
            </div>
            <Badge variant={data?.status === "active" ? "default" : "secondary"}>
              {data?.status}
            </Badge>
            <Badge variant="outline">{data?.type}</Badge>
            {data?.is_Power && <Badge variant="destructive">Power Lens</Badge>}
          </div>

          <p className="text-muted-foreground">{data?.desc}</p>
        </div>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Material</h4>
              <p>{data?.material?.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Shape</h4>
              <p>{data?.shape?.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Style</h4>
              <p>{data?.style?.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Gender</h4>
              <p>{data?.gender?.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Size</h4>
              <p>{data?.sizes?.join(", ")}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">HSN Code</h4>
              <p>{data?.hsn_code}</p>
            </div>
          </CardContent>
        </Card>

        {/* Variants Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {data?.variants?.map((variant: any, index: number) => (
                <form key={variant._id} method="GET">
                  <input type="hidden" name="variant" value={variant._id} />
                  <Button
                    type="submit"
                    variant={selectedVariant?._id === variant._id ? "default" : "outline"}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <span className="text-xs text-muted-foreground">Variant {index + 1}</span>
                    <span className="font-medium">{variant?.frame_color} Frame</span>
                    <span className="text-sm">{variant?.lens_color} Lens</span>
                    <span className="text-sm font-semibold">₹{variant?.price?.base_price}</span>
                  </Button>
                </form>
              ))}
            </div>

            {/* Selected Variant Details */}
            {selectedVariant && (
              <div className="border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Selected Variant Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variant Image */}
                  <div>
                    {selectedVariant?.images?.[0]?.url && (
                      <img
                        src={selectedVariant.images[0].url || "/placeholder.svg"}
                        alt={`${data?.brand_name} sunglasses variant`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  {/* Variant Info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Base Price</h4>
                        <p className="text-2xl font-bold">₹{selectedVariant?.price?.base_price}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">MRP</h4>
                        <p className="text-xl">₹{selectedVariant?.price?.mrp}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Frame Color</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">{selectedVariant?.frame_color}</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Temple Color</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline">{selectedVariant?.temple_color}</Badge>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Lens Color</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary">{selectedVariant?.lens_color}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Information */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Current Stock</h4>
                <p className="text-2xl font-bold text-green-600">{data?.stock?.current}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Minimum Stock</h4>
                <p className="text-lg">{data?.stock?.minimum}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Maximum Stock</h4>
                <p className="text-lg">{data?.stock?.maximum}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Business Name</h4>
                <p>{data?.vendorId?.business_name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p>{data?.vendorId?.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
                <p>{data?.vendorId?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default page;
