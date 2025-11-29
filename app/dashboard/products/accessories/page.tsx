import { getAllAccessories } from "@/actions/vendors/products";
import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { CategoryGuard } from "@/components/guards/CategoryGuard";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface AccessoriesTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const AccessoriesTable = async ({ searchParams }: AccessoriesTableProps) => {
  const resp = await getAllAccessories({
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
  });

  return <ProductsTable products={resp?.data?.accessories || []} type="accessories" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<AccessoriesTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `${searchP.search || "all"}-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <CategoryGuard requiredCategories={["Accessories"]} featureName="Accessories">
      <div className="flex flex-col gap-6">
        <SectionHeader title="Accessories" link={`add?type=accessories`} />
        <SearchAndFilter
          initialSearchTerm={searchP.search || ""}
          placeholder="Search accessories..."
        />
        <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
          <AccessoriesTable searchParams={searchP} />
        </Suspense>
      </div>
    </CategoryGuard>
  );
};

export default page;
