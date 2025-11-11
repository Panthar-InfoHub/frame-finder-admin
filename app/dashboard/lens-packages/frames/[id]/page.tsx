import { getFrameLensPackageById } from "@/actions/vendors/lens-package";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteLensPackageButton } from "@/components/lens-package/DeleteLensPackageButton";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <FrameDetails id={id} />
    </Suspense>
  );
};

const FrameDetails = async ({ id }: { id: string }) => {
  const resp = await getFrameLensPackageById(id);
  if (!resp.success) {
    return <div className="text-center text-red-500 mt-6">Unable to fetch the details</div>;
  }

  const pkg = resp.data;

  // Get signed URLs for images
  const imagesWithSignedUrls = pkg.images
    ? await Promise.all(
        pkg.images.map(async (image: any) => ({
          ...image,
          signedUrl: await getSignedViewUrl(image.url),
        }))
      )
    : [];

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/lens-packages/frames">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{pkg.display_name || pkg.productCode}</h1>
            <p className="text-sm text-muted-foreground">Frame Lens Package</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/lens-packages/frames/${id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <DeleteLensPackageButton id={id} type="frames" productCode={pkg.productCode} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Product Info - Takes 2 columns */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Product Code</p>
                <p className="font-mono font-medium">{pkg.productCode}</p>
              </div>
              {pkg.display_name && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-medium">{pkg.display_name}</p>
                </div>
              )}
              {pkg.brand_name && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="font-medium">{pkg.brand_name}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Index</p>
                <Badge variant="secondary">{pkg.index}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Prescription Type</p>
                <Badge className="capitalize">{pkg.prescription_type.replace("_", " ")}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Type</p>
                <p className="font-medium capitalize">{pkg.lens_type.replace("_", " ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processing Time</p>
                <p className="font-medium">{pkg.duration} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing - Takes 1 column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">MRP</p>
              <p className="text-xl font-bold">₹{pkg.price.mrp.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Discounted Price</p>
              <p className="text-lg font-semibold">₹{pkg.price.base_price.toLocaleString()}</p>
            </div>
            <div className="space-y-1 pt-2 border-t">
              <p className="text-sm text-muted-foreground">Final Price</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{pkg.price.total_price.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images - Full width if exists */}
        {imagesWithSignedUrls.length > 0 && (
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagesWithSignedUrls.map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={image.signedUrl}
                      alt={`Lens package ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default page;
