import { getAllAccessories } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const AccessoriesTable = async () => {
  const resp = await getAllAccessories();
  return <ProductsTable products={resp?.data?.products} type="accessories" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Accessories" link={`add?type=accessories`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <AccessoriesTable />
      </Suspense>
    </div>
  );
};

export default page;
