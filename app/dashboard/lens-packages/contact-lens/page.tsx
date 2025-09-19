import { PackagesTable } from "@/components/lens-package/lensPackageTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const ContactLensTable = async () => {
  return <PackagesTable products={[]} type="contact-lens" />;
};

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Contact Lens Package" link={`add?type=contact-lens`} />
      <SectionFilterSort />
      <Suspense fallback={<DashboardSkeleton />}>
        <ContactLensTable />
      </Suspense>
    </div>
  );
};

export default page;
