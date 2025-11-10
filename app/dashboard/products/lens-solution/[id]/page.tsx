import { getLensSolutionById, deleteLensSolutionAction } from "@/actions/vendors/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import { Edit, Star, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LensSolutionStockUpdateDialog from "@/components/products/lens-solution/lens-solution-stock-update-dialog";
import { getSignedViewUrl } from "@/actions/cloud-storage";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LensSolutionDetails id={id} />
    </Suspense>
  );
};

const LensSolutionDetails = async ({ id }: { id: string }) => {
  let resp = await getLensSolutionById(id);
  if (!resp.success) {
    return <div>Unable to fetch the lens solution details</div>;
  }

  const data = resp?.data;
  resp = {
    ...data,
    variants: await Promise.all(
      (data.variants || []).map(async (variant) => {
        if (variant.images && variant.images.length > 0) {
          const signedImages = await Promise.all(
            variant.images.map(async (img: any) => ({
              ...img,
              signedUrl: await getSignedViewUrl(img.url),
            }))
          );
          return { ...variant, images: signedImages };
        }
        return variant;
      })
    ),
  };

  console.log("Lens Solution Details:", resp);

  if (!resp) {
    return <div className="p-4">No product data available</div>;
  }

  return (
    <section className="min-h-screen bg-background w-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <BackButton href="/dashboard/products/lens-solution" className="mb-4">
          Back to Lens Solutions
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
            <Link href={`/dashboard/products/lens-solution/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <DeleteDialog
              productId={id}
              deleteProductFunc={deleteLensSolutionAction}
              redirectUrl="/dashboard/products/lens-solution"
            />
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
                <p className="text-sm text-muted-foreground">Brand Name</p>
                <p className="font-medium">{resp?.brand_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-medium">{resp?.rating} / 5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        {resp?.variants?.map((variant: any, index: number) => (
          <Card key={variant._id || index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Variant {index + 1} - {variant.sizes}
              </CardTitle>
              <LensSolutionStockUpdateDialog
                productId={id}
                variantId={variant._id}
                currentStock={variant.stock?.current || 0}
              >
                <Button size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Update Stock
                </Button>
              </LensSolutionStockUpdateDialog>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specifications */}
              <div>
                <h4 className="font-semibold mb-3">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{variant.sizes}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lens Material</p>
                    <p className="font-medium">{variant.lens_material?.join(", ") || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">HSN Code</p>
                    <p className="font-medium">{variant.hsn_code}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Country of Origin</p>
                    <p className="font-medium">{variant.origin_country || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Case Available</p>
                    <Badge variant={variant.case_available ? "default" : "secondary"}>
                      {variant.case_available ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Dates */}
              {(variant.mfg_date || variant.exp_date) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {variant.mfg_date && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                        <p className="font-medium">
                          {new Date(variant.mfg_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {variant.exp_date && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">
                          {new Date(variant.exp_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="font-medium text-xl">₹{variant.price?.base_price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">MRP</p>
                    <p className="font-medium text-xl">₹{variant.price?.mrp}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Shipping</p>
                    <p className="font-medium text-xl">
                      ₹
                      {variant.price?.shipping_price?.custom
                        ? variant.price?.shipping_price?.value
                        : 100}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-medium text-xl text-primary">
                      ₹{variant.price?.total_price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Stock Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className="font-medium text-xl">{variant.stock?.current || 0} units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum Stock</p>
                    <p className="font-medium text-xl">{variant.stock?.minimum || 5} units</p>
                  </div>
                </div>
              </div>

              {/* Images */}
              {variant.images && variant.images.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Product Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {variant.images.map((image: any, imgIndex: number) => (
                      <div key={imgIndex} className="relative aspect-square">
                        <img
                          src={image.signedUrl || image.url}
                          alt={`${resp.brand_name} - Variant ${index + 1} - Image ${imgIndex + 1}`}
                          className="w-full h-full object-cover rounded-md border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default page;
