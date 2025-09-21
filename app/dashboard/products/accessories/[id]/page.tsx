import { getAccessoryById } from "@/actions/vendors/products";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AccessoriesDetails id={id} />
    </Suspense>
  );
};

const AccessoriesDetails = async ({ id }: { id: string }) => {
  const resp = await getAccessoryById(id);
  if (!resp) return <div>Accessories not found</div>;
  return <pre lang="json">{JSON.stringify(resp, null, 2)}</pre>;
};

export default page;
