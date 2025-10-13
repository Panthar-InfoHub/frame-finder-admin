import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";
import { getAllColorContactLenses } from "@/actions/vendors/products";

interface ColorContactLensTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const ColorContactLensTable = async ({ searchParams }: ColorContactLensTableProps) => {
  const resp = await getAllColorContactLenses(
    parseInt(searchParams.page || "1"),
    parseInt(searchParams.limit || "10"),
    searchParams.search || ""
  );

  return <ProductsTable products={resp?.data?.products || []} type="contact-lens-color" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<ColorContactLensTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `${searchP.search || "all"}-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Color Contact Lenses" link={`add?type=contact-lens-color`} />
      <SearchAndFilter
        initialSearchTerm={searchP.search || ""}
        placeholder="Search color contact lenses..."
      />
      <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
        <ColorContactLensTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
