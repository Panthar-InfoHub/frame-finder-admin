import { getAccessoryById } from "@/actions/vendors/products";
import EditAccessoriesForm from "@/components/products/accessories/edit-accessories-form";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EditAccessoriesPage id={id} />
    </Suspense>
  );
};

const EditAccessoriesPage = async ({ id }: { id: string }) => {
  const resp = await getAccessoryById(id);
  if (!resp.success) {
    return <div>Unable to fetch the Accessory details</div>;
  }

  return <EditAccessoriesForm accessory={resp.data} />;
};

export default page;
