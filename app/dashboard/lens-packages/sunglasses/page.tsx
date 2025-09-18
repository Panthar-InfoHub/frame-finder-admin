import { getAllSunglassLensPackages } from "@/actions/vendors/lens-package";
import { PackagesTable } from "@/components/products/lensPackageTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/products/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const SunglassesTable = async () => {
  const resp = await getAllSunglassLensPackages();
  if (!resp?.success) {
    return <div className="text-center text-red-500 text-sm mt-6">{resp?.message}</div>;
  }

  const data = resp?.data?.lensPackages || [];
  return <PackagesTable products={data} type="sunglasses" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Sunglass Lens Package" link={`add?type=sunglasses`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <SunglassesTable />
      </Suspense>
    </div>
  );
};

export default page;
