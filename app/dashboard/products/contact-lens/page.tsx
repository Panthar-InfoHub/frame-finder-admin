import ProductsTable from "@/components/products/productsTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const ContactLensTable = async () => {
  return <ProductsTable products={[]} type="contact-lens" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Contact Lenses" link={`add?type=contact-lens`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <ContactLensTable />
      </Suspense>
    </div>
  );
};

export default page;
