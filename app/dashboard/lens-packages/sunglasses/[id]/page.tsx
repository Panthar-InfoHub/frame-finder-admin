import { getSunglassLensPackageById } from "@/actions/vendors/lens-package";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SunglassDetails id={id} />
    </Suspense>
  );
};

const SunglassDetails = async ({ id }: { id: string }) => {
  const resp = await getSunglassLensPackageById(id);
  if (!resp.success){
    return <div>Unable to get the details of your lens package</div>
  }
  return <div>SunglassDetails {JSON.stringify(resp, null , 2)}</div>;
};

export default page;
