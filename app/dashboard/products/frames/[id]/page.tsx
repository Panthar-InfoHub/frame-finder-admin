import { getFrameById, deleteFrameAction } from "@/actions/vendors/products";
import { FrameVariantStock } from "@/components/products/frames/FrameVariantStock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import { Edit, Package, Star } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
      <FrameDetails id={id} searchParams={searchParams} />
    </Suspense>
  );
};

const FrameDetails = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { variant?: string };
}) => {
  let resp = await getFrameById(id);
  if (!resp.success) {
    return <div>unable to fetch the Frame detail</div>;
  }

  resp = resp?.data;

  const selectedVariantId = (await searchParams)?.variant;
  const selectedVariant = selectedVariantId
    ? resp?.variants?.find((variant: any) => variant._id === selectedVariantId) ||
      resp?.variants?.[0]
    : resp?.variants?.[0];

  if (!resp) {
    return <div className="p-4">No product data available</div>;
  }

  return (
    <section className="min-h-screen bg-background w-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <BackButton href="/dashboard/products/frames" className="mb-4">
          Back to Frames
        </BackButton>

        {/* Product Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{resp?.brand_name}</h1>
            <div className="flex space-x-2">
              <Badge variant="secondary">{resp?.productCode}</Badge>
              <Link href={`/dashboard/products/frames/${id}/edit`}>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>

              <DeleteDialog
                productId={id}
                deleteProductFunc={deleteFrameAction}
                redirectUrl="/dashboard/products/frames"
              />

              <FrameVariantStock product={resp}>
                <Button variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Update Stock
                </Button>
              </FrameVariantStock>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{resp?.rating}</span>
            </div>
            <Badge variant={resp?.status === "active" ? "default" : "secondary"}>
              {resp?.status}
            </Badge>
          </div>

          <p className="text-muted-foreground">{resp?.desc}</p>
        </div>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">Material</h4>
              <p>{resp?.material?.join(", ")}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">Shape</h4>
              <p>{resp?.shape?.join(", ")}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">Style</h4>
              <p>{resp?.style?.join(", ")}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">Gender</h4>
              <p>{resp?.gender?.join(", ")}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">Size</h4>
              <p>{resp?.sizes?.join(", ")}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 border">
              <h4 className="font-medium text-sm text-muted-foreground">HSN Code</h4>
              <p>{resp?.hsn_code}</p>
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
              {resp?.variants?.map((variant: any, index: number) => (
                <form key={variant._id} method="GET">
                  <input type="hidden" name="variant" value={variant._id} />
                  <Button
                    type="submit"
                    variant={selectedVariant?._id === variant._id ? "default" : "outline"}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <span className="text-xs  font-bold">Variant {index + 1}</span>
                    <span className="font-medium">{variant?.frame_color?.join("/")} Frame</span>
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
                        alt={`${resp?.brand_name} variant`}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Frame Color</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariant?.frame_color?.map((color: string) => (
                            <Badge key={color} variant="outline">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Temple Color</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedVariant?.temple_color?.map((color: string) => (
                            <Badge key={color} variant="outline">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-xl border">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Stock Status
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">
                          {selectedVariant?.stock?.current} units
                        </span>
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
                  </div>
                </div>
              </div>
            )}
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
                <p>{resp?.vendorId?.business_name}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p>{resp?.vendorId?.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
                <p>{resp?.vendorId?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default page;
