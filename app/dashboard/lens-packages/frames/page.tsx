import { getAllFrameLensPackages } from "@/actions/vendors/lens-package";
import { PackagesTable } from "@/components/lens-package/lensPackageTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";

import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";

import React, { Suspense } from "react";

interface FramesLensPackageTableProps {
  searchParams: {
    page?: string;
    limit?: string;
    code?: string;
  };
}

const FramesLensPackageTable = async ({ searchParams }: FramesLensPackageTableProps) => {
  const resp = await getAllFrameLensPackages({
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    code: searchParams.code || "",
  });

  if (!resp?.success) {
    return <div className="text-center text-red-500 text-sm mt-6">{resp?.message}</div>;
  }

  console.debug("Frames Lens Package response ==> ", resp.data?.lensPackages);
  const data = resp?.data?.lensPackages || [];
  return <PackagesTable products={data} type="frames" />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<FramesLensPackageTableProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Frames Lens Package" link={`add?type=frames`} />
      <SearchAndFilter
        initialSearchTerm={searchP.code || ""}
        placeholder="Search by lens package code..."
        searchParamName="code"
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <FramesLensPackageTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
