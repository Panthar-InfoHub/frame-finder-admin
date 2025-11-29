import { getAllLensSolutions } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { CategoryGuard } from "@/components/guards/CategoryGuard";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface LensSolutionTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const LensSolutionTable = async ({ searchParams }: LensSolutionTableProps) => {
  const resp = await getAllLensSolutions(
    parseInt(searchParams.page || "1"),
    parseInt(searchParams.limit || "10"),
    searchParams.search || ""
  );

  return <ProductsTable products={resp?.data?.products || []} type="lens-solution" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<LensSolutionTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `${searchP.search || "all"}-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <CategoryGuard requiredCategories={["LensSolution"]} featureName="Lens Solution">
      <div className="flex flex-col gap-6">
        <SectionHeader title="Lens Solution" link={`add?type=lens-solution`} />
        <SearchAndFilter
          initialSearchTerm={searchP.search || ""}
          placeholder="Search lens solutions..."
        />
        <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
          <LensSolutionTable searchParams={searchP} />
        </Suspense>
      </div>
    </CategoryGuard>
  );
};

export default page;
