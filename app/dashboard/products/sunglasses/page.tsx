import { getAllSunglasses } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/products/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const SunglassesTable = async () => {
  const resp = await getAllSunglasses();
  return <ProductsTable products={resp?.data?.sunglass} type="sunglasses" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Sunglasses" link={`add?type=sunglasses`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <SunglassesTable />
      </Suspense>
    </div>
  );
};

export default page;
