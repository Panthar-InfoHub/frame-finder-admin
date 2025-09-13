import { getAllFrameLensPackages } from "@/actions/vendors/lens-package";
import { PackagesTable } from "@/components/products/lensPackageTable";
import SectionFilterSort from "@/components/products/SectionFilterSort";
import SectionHeader from "@/components/products/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

const ContactLensTable = async () => {
  return <PackagesTable products={[]} />;
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
