import { searchCMSEntries } from "@/actions/cms";
import { CMSTable } from "@/components/cms/CMSTable";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";
import { Pagination } from "@/components/dashboard/Pagination";

interface CMSPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

const CMSTableWrapper = async ({ searchParams }: CMSPageProps) => {
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");

  const resp = await searchCMSEntries(page, limit);

  if (!resp?.success) {
    return <div className="text-center text-red-500 text-sm mt-6">{resp?.message}</div>;
  }

  const data = resp?.data || [];
  const pagination = resp?.pagination;

  return (
    <>
      <CMSTable entries={data} />
      {pagination && pagination.total_pages > 1 && (
        <Pagination
          page={pagination.current_page}
          totalPages={pagination.total_pages}
          useUrlNavigation={true}
        />
      )}
    </>
  );
};

const page = async ({ searchParams }: { searchParams: Promise<CMSPageProps["searchParams"]> }) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `cms-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="CMS Management" link="cms/add" />

      <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
        <CMSTableWrapper searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
