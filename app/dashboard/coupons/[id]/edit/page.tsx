import { getCouponById } from "@/actions/coupons";
import { CouponForm } from "@/components/coupons/CouponForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/ui/custom/Skeleton-loading";
import { getSession } from "@/actions/session";
import { Role } from "@/utils/permissions";

const EditCouponContent = async ({ id, userRole }: { id: string; userRole?: Role }) => {
  const resp = await getCouponById(id);

  if (!resp.success || !resp.data) {
    return (
      <div className="text-center text-red-500 mt-6">Unable to get the details of the coupon</div>
    );
  }

  return <CouponForm mode="edit" initialData={resp.data} userRole={userRole} />;
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { user } = await getSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/coupons">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Coupon</h1>
          <p className="text-sm text-muted-foreground">Update coupon details</p>
        </div>
      </div>

      {/* Form */}
      <Suspense fallback={<DashboardSkeleton />}>
        <EditCouponContent id={id} userRole={user?.role} />
      </Suspense>
    </div>
  );
};

export default page;
