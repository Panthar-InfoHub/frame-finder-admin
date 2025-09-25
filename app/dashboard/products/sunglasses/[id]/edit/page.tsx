import EditSunglassForm from "@/components/products/sunglasses/edit-sunglasses-form";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import React, { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <EditSunglassForm sunglassId={id} />
      </Suspense>
    </div>
  );
};

export default page;
