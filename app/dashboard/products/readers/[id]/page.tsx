import { getReaderById, deleteReader } from "@/actions/vendors/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { DeleteDialog } from "@/components/products/deleteDialog";
import { BackButton } from "@/components/ui/back-button";
import ReaderVariantsDisplay from "@/components/products/readers/ReaderVariantsDisplay";
import { ReaderVariantStock } from "@/components/products/readers/ReaderVariantStock";
import { Edit, Package, Star, Ruler } from "lucide-react";
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
      <ReaderDetails id={id} searchParams={searchParams} />
    </Suspense>
  );
};

const ReaderDetails = async ({
  id,
  searchParams,
}: {
  id: string;
  searchParams: { variant?: string };
}) => {
  const result = await getReaderById(id);
  if (!result.success) {
    return <div>Unable to fetch the Reader details</div>;
  }

  const resp = result?.data;

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
        <BackButton href="/dashboard/products/readers" className="mb-4">
          Back to Readers
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
            <ReaderVariantStock product={resp}>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Update Stock
              </Button>
            </ReaderVariantStock>

            <Link href={`/dashboard/products/readers/${id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <DeleteDialog
              productId={id}
              deleteProductFunc={deleteReader}
              redirectUrl="/dashboard/products/readers"
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
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{resp?.material?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Shape</p>
                <p className="font-medium">{resp?.shape?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Style</p>
                <p className="font-medium">{resp?.style?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{resp?.gender?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sizes</p>
                <p className="font-medium">{resp?.sizes?.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">HSN Code</p>
                <p className="font-medium">{resp?.hsn_code}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Width</p>
                <p className="font-medium">{resp?.dimension?.lens_width}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bridge Width</p>
                <p className="font-medium">{resp?.dimension?.bridge_width}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temple Length</p>
                <p className="font-medium">{resp?.dimension?.temple_length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lens Height</p>
                <p className="font-medium">{resp?.dimension?.lens_height}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants - Tab Based Display */}
        <ReaderVariantsDisplay
          variants={resp?.variants || []}
          brandName={resp?.brand_name || ""}
          initialVariantId={selectedVariantId}
        />
      </div>
    </section>
  );
};

export default page;
