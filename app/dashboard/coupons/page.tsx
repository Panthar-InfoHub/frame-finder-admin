import { searchCoupons } from "@/actions/coupons";
import { CouponTable } from "@/components/coupons/CouponTable";
import SearchAndFilter from "@/components/products/SearchAndFilter";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { Suspense } from "react";

interface CouponsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
  };
}

const CouponsTable = async ({ searchParams }: CouponsPageProps) => {
  const resp = await searchCoupons({
    page: parseInt(searchParams.page || "1"),
    limit: parseInt(searchParams.limit || "10"),
    search: searchParams.search || "",
  });

  if (!resp?.success) {
    return <div className="text-center text-red-500 text-sm mt-6">{resp?.message}</div>;
  }

  const data = resp?.data?.coupons || [];
  return <CouponTable coupons={data} />;
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<CouponsPageProps["searchParams"]>;
}) => {
  const searchP = await searchParams;

  // Create a unique key based on search parameters to trigger Suspense fallback
  const suspenseKey = `${searchP.search || "all"}-${searchP.page || "1"}-${searchP.limit || "10"}`;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Coupons" link="coupons/add" />
      <SearchAndFilter
        initialSearchTerm={searchP.search || ""}
        placeholder="Search by coupon code..."
        searchParamName="search"
      />
      <Suspense key={suspenseKey} fallback={<DashboardSkeleton />}>
        <CouponsTable searchParams={searchP} />
      </Suspense>
    </div>
  );
};

export default page;
