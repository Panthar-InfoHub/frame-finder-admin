import React, { Suspense } from "react";
import { getFrameLensPackageById } from "@/actions/vendors/lens-package";
import FrameLensPackageEditForm from "@/components/lens-package/frame-lens-package-edit-form";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <EditFormWrapper id={id} />
    </Suspense>
  );
};

const EditFormWrapper = async ({ id }: { id: string }) => {
  const resp = await getFrameLensPackageById(id);

  if (!resp.success) {
    return <div className="text-center text-red-500 mt-6">Unable to fetch package details</div>;
  }

  return <FrameLensPackageEditForm id={id} initialData={resp.data} />;
};

export default page;
