import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ContactLensDetails id={id} />
    </Suspense>
  );
};

const ContactLensDetails = async ({ id }: { id: string }) => {
  return <div>ContactLensDetails {id}</div>;
};

export default page;
