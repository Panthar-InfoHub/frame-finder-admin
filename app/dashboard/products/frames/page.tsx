import { getAllFrames } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface FramesTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const FramesTable = async ({ searchParams }: FramesTableProps) => {
  const resp = await getAllFrames({
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
  });

  return <ProductsTable products={resp?.data?.products || []} type="frames" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<FramesTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Frames" link={`add?type=frames`} />
      <SearchAndFilter initialSearchTerm={searchP.search || ""} placeholder="Search frames..." />
      <Suspense fallback={<DashboardSkeleton />}>
        <FramesTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
