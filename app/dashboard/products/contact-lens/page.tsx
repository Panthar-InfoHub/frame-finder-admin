import ProductsTable from "@/components/products/productsTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";
import { getAllContactLenses } from "@/actions/vendors/products";

interface ContactLensTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const ContactLensTable = async ({ searchParams }: ContactLensTableProps) => {
  const resp = await getAllContactLenses({
    type: "contact_lens",
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
  });

  console.debug("Contact Lens response ==> ", resp.data?.products);
  return <ProductsTable products={resp?.data?.products || []} type="contact-lens" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<ContactLensTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Contact Lenses" link={`add?type=contact-lens`} />
      <SearchAndFilter
        initialSearchTerm={searchP.search || ""}
        placeholder="Search contact lenses..."
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <ContactLensTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
