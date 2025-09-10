import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SunglassesDetails id={id} />
    </Suspense>
  );
};

const SunglassesDetails = async ({ id }: { id: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <div>SunglassesDetails {id}</div>;
};

export default page;
