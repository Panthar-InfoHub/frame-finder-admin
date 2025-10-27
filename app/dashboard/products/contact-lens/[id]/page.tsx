import { getContactLensById, deleteContactLensAction } from "@/actions/vendors/products";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import { ContactLensVariantStock } from "@/components/products/contact-lens/ContactLensVariantStock";
import { Edit, Package, Star } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";


const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ContactLensDetails id={id} />
    </Suspense>
  );
};


const ContactLensDetails = async ({ id }: { id: string }) => {
  let resp = await getContactLensById(id);
  if (!resp?.success) {
    return <div>Unable to fetch Contact Lens details</div>;
  }

  const data = resp?.data;

  if (!data) {
    return <div className="p-4">No product data available</div>;
  }

  const transformedData = {
    ...data,
    variant: await Promise.all(
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

  // Map lens type to display name
  const lensTypeDisplay = {
    non_toric: "Non-Toric",
    toric: "Toric",
    multi_focal: "Multi-Focal",
  };

  return (
    <section className="min-h-screen bg-background w-full">
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <BackButton href="/dashboard/products/contact-lens" className="mb-4">
          Back to Contact Lenses
        </BackButton>

        {/* Product Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{transformedData?.brand_name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{transformedData?.rating || 0}</span>
              </div>
              <Badge variant={transformedData?.status === "active" ? "default" : "secondary"}>
                {transformedData?.status}
              </Badge>
              {transformedData?.contact_lens_cover && (
                <Badge variant="outline">Contact Lens Cover Included</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Link href={`/dashboard/products/contact-lens/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <DeleteDialog
              productId={id}
              deleteProductFunc={deleteContactLensAction}
              redirectUrl="/dashboard/products/contact-lens"
            />

            <ContactLensVariantStock product={transformedData}>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Update Stock
              </Button>
            </ContactLensVariantStock>
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
                <p className="font-medium">{transformedData?.productCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Type</p>
                <p className="font-medium">
                  {lensTypeDisplay[transformedData?.lens_type as keyof typeof lensTypeDisplay]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Available Sizes</p>
                <p className="font-medium">{transformedData?.size?.join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transformedData?.variants?.map((variant: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Variant {index + 1} - {variant.disposability}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">HSN Code</p>
                        <p className="font-medium">{variant.hsn_code}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pieces per Box</p>
                        <p className="font-medium">{variant.pieces_per_box}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Manufacturing Date</p>
                        <p className="font-medium">
                          {new Date(variant.mfg_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">
                          {new Date(variant.exp_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Base Price</p>
                        <p className="font-medium">₹{variant.price?.base_price}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">MRP</p>
                        <p className="font-medium">₹{variant.price?.mrp}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="font-medium">{variant.stock?.current}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Minimum Stock</p>
                        <p className="font-medium">{variant.stock?.minimum}</p>
                      </div>
                    </div>

                    {/* Power Range */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Power Range</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Spherical</p>
                          <p className="font-medium">
                            {variant.power_range?.spherical?.min} to{" "}
                            {variant.power_range?.spherical?.max}
                          </p>
                        </div>
                        {variant.power_range?.cylindrical && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Cylindrical</p>
                            <p className="font-medium">
                              {variant.power_range?.cylindrical?.min} to{" "}
                              {variant.power_range?.cylindrical?.max}
                            </p>
                          </div>
                        )}
                        {variant.power_range?.addition && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Addition</p>
                            <p className="font-medium">
                              {variant.power_range?.addition?.min} to{" "}
                              {variant.power_range?.addition?.max}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Images */}
                    {variant.images && variant.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Images</h4>
                        <div className="flex gap-2 flex-wrap">
                          {variant.images.map((img: any, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={img.signedUrl || img.url}
                              alt={`Variant ${index + 1} - Image ${imgIndex + 1}`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default page;
