import { getSunglassLensPackageById } from "@/actions/vendors/lens-package";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";
import { getSunglassById } from "@/actions/vendors/products";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SunglassesDetails id={id} />
    </Suspense>
  );
};

const SunglassesDetails = async ({ id }: { id: string }) => {
  const resp = await getSunglassById(id);
  if (!resp.success){
    return <div>Unable to fetch the details</div>
  }
  return <pre lang="json">{JSON.stringify(resp, null, 2)}</pre>;
};

export default page;
