"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coupon } from "@/types/coupon";

interface CouponDetailsDialogProps {
  coupon: Coupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CouponDetailsDialog({ coupon, open, onOpenChange }: CouponDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = new Date(coupon.exp_date) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono text-2xl">{coupon.code}</span>
            {isExpired ? (
              <Badge variant="destructive">Expired</Badge>
            ) : coupon.is_active ? (
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Discount Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Discount Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Discount Type</p>
                  <Badge variant="secondary" className="capitalize">
                    {coupon.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Discount Value</p>
                  <p className="text-2xl font-bold">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope & Restrictions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Scope & Restrictions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Scope</p>
                  <Badge variant={coupon.scope === "global" ? "default" : "outline"}>
                    {coupon.scope}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Minimum Order Amount</p>
                  <p className="font-medium">
                    {coupon.min_order_limit ? `₹${coupon.min_order_limit}` : "No minimum"}
                  </p>
                </div>
                {coupon.scope === "vendor" && typeof coupon.vendorId === "object" && (
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{coupon.vendorId.business_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Owner: {coupon.vendorId.business_owner}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Usage Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Usage Limit</p>
                  <p className="text-lg font-semibold">{coupon.usage_limit || "Unlimited"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Per User Limit</p>
                  <p className="text-lg font-semibold">{coupon.user_usage_limit || "Unlimited"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Important Dates</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className={`font-medium ${isExpired ? "text-red-500" : ""}`}>
                    {formatDate(coupon.exp_date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="text-sm">{formatDate(coupon.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(coupon.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
