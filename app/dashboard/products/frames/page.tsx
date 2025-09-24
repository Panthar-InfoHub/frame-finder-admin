import { getAllFrames } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const FramesTable = async () => {
  const resp = await getAllFrames();

  console.debug("Response ===> ", resp.data.products)
  return <ProductsTable products={resp?.data?.products} type="frames" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Frames" link={`add?type=frames`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <FramesTable />
      </Suspense>
    </div>
  );
};

export default page;
