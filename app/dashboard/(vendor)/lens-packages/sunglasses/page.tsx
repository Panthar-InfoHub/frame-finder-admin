import { getAllSunglassLensPackages } from "@/actions/vendors/lens-package";
import { PackagesTable } from "@/components/products/lensPackageTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/products/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const SunglassesTable = async () => {
  const resp = await getAllSunglassLensPackages();
  return <PackagesTable products={resp?.data?.lensPackage} />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Frames Lens Package" link={`add?type=frames`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <SunglassesTable />
      </Suspense>
    </div>
  );
};

export default page;
