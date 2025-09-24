import { getAllSunglasses } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface SunglassesTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const SunglassesTable = async ({ searchParams }: SunglassesTableProps) => {
  const resp = await getAllSunglasses({
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
  });

  console.debug("Response ===> ", resp.data?.sunglass);
  return <ProductsTable products={resp?.data?.sunglass || []} type="sunglasses" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<SunglassesTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Sunglasses" link={`add?type=sunglasses`} />
      <SearchAndFilter
        initialSearchTerm={searchP.search || ""}
        placeholder="Search sunglasses..."
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <SunglassesTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
