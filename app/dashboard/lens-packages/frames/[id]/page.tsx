import { getFrameLensPackageById } from "@/actions/vendors/lens-package";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
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
  if (!resp.success){
    return <div>Unable to fetch the details</div>
  }
  return <div>FrameDetails {JSON.stringify(resp, null , 2)}</div>;
};

export default page;
