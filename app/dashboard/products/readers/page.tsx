import { getAllReaders } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { CategoryGuard } from "@/components/guards/CategoryGuard";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface ReadersTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const ReadersTable = async ({ searchParams }: ReadersTableProps) => {
  const resp = await getAllReaders(
    parseInt(searchParams.page || "1"),
    parseInt(searchParams.limit || "10"),
    searchParams.search || ""
  );

  return <ProductsTable products={resp?.data?.products || []} type="readers" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<ReadersTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `${searchP.search || "all"}-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <CategoryGuard requiredCategories={["Reader"]} featureName="Reader Glasses">
      <div className="flex flex-col gap-6">
        <SectionHeader title="Reader Glasses" link={`add?type=readers`} />
        <SearchAndFilter initialSearchTerm={searchP.search || ""} placeholder="Search readers..." />
        <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
          <ReadersTable searchParams={searchP} />
        </Suspense>
      </div>
    </CategoryGuard>
  );
};

export default page;
