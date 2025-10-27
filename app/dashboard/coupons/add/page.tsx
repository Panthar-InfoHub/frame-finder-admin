import { CouponForm } from "@/components/coupons/CouponForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/actions/session";

const page = async () => {
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
          <h1 className="text-2xl font-bold">Create New Coupon</h1>
          <p className="text-sm text-muted-foreground">Add a new discount coupon</p>
        </div>
      </div>

      {/* Form */}
      <CouponForm mode="create" userRole={user?.role} />
    </div>
  );
};

export default page;
