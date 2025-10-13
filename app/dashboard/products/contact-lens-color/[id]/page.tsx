import { getColorContactLensById, deleteColorContactLensAction } from "@/actions/vendors/products";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Eye, Pencil, Trash2, Package } from "lucide-react";
import { ColorContactLensVariantStock } from "@/components/products/contact-lens-color/ColorContactLensVariantStock";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import Image from "next/image";

async function deleteColorContactLens(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const resp = await deleteColorContactLensAction(id);
  if (resp.success) {
    redirect("/dashboard/products/contact-lens-color");
  }
}

export default async function ColorContactLensDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resp = await getColorContactLensById(id);
  if (!resp?.success || !resp?.data) {
    notFound();
  }

  const product = resp.data;

  const getStockBadgeVariant = (current: number, minimum: number) => {
    if (current <= minimum) return "destructive";
    if (current <= minimum * 2) return "secondary";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/products/contact-lens-color">
          Back to Color Contact Lenses
        </BackButton>
        <div className="flex gap-2">
          <ColorContactLensVariantStock product={product}>
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-2" />
              Update Stock
            </Button>
          </ColorContactLensVariantStock>
          <Link href={`/dashboard/products/contact-lens-color/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <form action={deleteColorContactLens}>
            <input type="hidden" name="id" value={id} />
            <Button variant="destructive" size="sm" type="submit">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{product.brand_name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{product.productCode}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={product.lens_type === "zero_power" ? "secondary" : "default"}>
                {product.lens_type === "zero_power" ? "Zero Power" : "With Power"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Brand Name</span>
              <p className="font-medium">{product.brand_name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Product Code</span>
              <p className="font-medium">{product.productCode}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Lens Cover</span>
              <p className="font-medium">{product.contact_lens_cover ? "Yes" : "No"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <span className="text-sm text-muted-foreground">Available Sizes</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {product.size?.map((size: string) => (
                <Badge key={size} variant="outline">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        {product.variant?.map((variant: any, index: number) => (
          <Card key={variant._id || index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">
                    Variant {index + 1} - {variant.color || "Unknown Color"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {variant.disposability} • {variant.pieces_per_box} pcs/box
                  </p>
                </div>
                <Badge
                  variant={getStockBadgeVariant(
                    variant.stock?.current || 0,
                    variant.stock?.minimum || 5
                  )}
                >
                  Stock: {variant.stock?.current || 0} units
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Variant Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Color</span>
                  <p className="font-medium">{variant.color}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">HSN Code</span>
                  <p className="font-medium">{variant.hsn_code}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Pieces per Box</span>
                  <p className="font-medium">{variant.pieces_per_box}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Manufacturing Date</span>
                  <p className="font-medium">{new Date(variant.mfg_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Expiry Date</span>
                  <p className="font-medium">{new Date(variant.exp_date).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div>
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Base Price</span>
                    <p className="font-medium">₹{variant.price?.base_price || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">MRP</span>
                    <p className="font-medium">₹{variant.price?.mrp || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <p className="font-medium">₹{variant.price?.shipping_price?.value || 0}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Total Price</span>
                    <p className="font-medium">₹{variant.price?.total_price || 0}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stock */}
              <div>
                <h4 className="font-semibold mb-3">Stock Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Current Stock</span>
                    <p className="font-medium">{variant.stock?.current || 0} units</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Minimum Stock</span>
                    <p className="font-medium">{variant.stock?.minimum || 5} units</p>
                  </div>
                </div>
              </div>

              {/* Power Range (if applicable) */}
              {variant.power_range?.spherical && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Power Range</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Spherical Min</span>
                        <p className="font-medium">{variant.power_range.spherical.min}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Spherical Max</span>
                        <p className="font-medium">{variant.power_range.spherical.max}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Images */}
              {variant.images && variant.images.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {variant.images.map(async (image: any, imgIndex: number) => {
                        const signedUrl = await getSignedViewUrl(image.url);
                        return (
                          <div
                            key={imgIndex}
                            className="relative aspect-square rounded-lg overflow-hidden border"
                          >
                            <Image
                              src={signedUrl}
                              alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
