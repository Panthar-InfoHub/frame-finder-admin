"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createCoupon, updateCoupon } from "@/actions/coupons";
import { Coupon, CreateCouponPayload } from "@/types/coupon";
import { Loader2 } from "lucide-react";
import { Role } from "@/utils/permissions";

interface CouponFormProps {
  initialData?: Coupon;
  mode: "create" | "edit";
  userRole?: Role;
}

export function CouponForm({ initialData, mode, userRole = "VENDOR" }: CouponFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  // Set initial scope based on user role and initialData
  const getInitialScope = (): "vendor" | "global" => {
    if (initialData?.scope) return initialData.scope;
    return isAdmin ? "global" : "vendor";
  };

  const [selectedScope, setSelectedScope] = useState<"vendor" | "global">(getInitialScope());
  const [discountType, setDiscountType] = useState<"number" | "percentage">(
    initialData?.type || "percentage"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Build payload
    const payload: CreateCouponPayload = {
      code: initialData?.code,
      type: formData.get("type") as "number" | "percentage",
      value: Number(formData.get("value")),
      scope: isAdmin ? (formData.get("scope") as "vendor" | "global") : "vendor",
      exp_date: formData.get("exp_date") as string,
    };

    // Optional fields
    const minOrderLimit = formData.get("min_order_limit");
    if (minOrderLimit && minOrderLimit !== "") {
      payload.min_order_limit = Number(minOrderLimit);
    }

    const usageLimit = formData.get("usage_limit");
    if (usageLimit && usageLimit !== "") {
      payload.usage_limit = Number(usageLimit);
    }

    const userUsageLimit = formData.get("user_usage_limit");
    if (userUsageLimit && userUsageLimit !== "") {
      payload.user_usage_limit = Number(userUsageLimit);
    }

    // For admin: manual vendor ID input, For vendor: handled by backend with session
    if (isAdmin) {
      const vendorId = formData.get("vendorId");
      if (vendorId && vendorId !== "" && payload.scope === "vendor") {
        payload.vendorId = vendorId as string;
      }
    }

    try {
      let response;
      if (mode === "create") {
        response = await createCoupon(payload);
      } else {
        const updatePayload = {
          ...payload,
          is_active: formData.get("is_active") === "on",
        };
        response = await updateCoupon(initialData!._id, updatePayload);
      }

      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard/coupons");
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                placeholder="e.g., WELCOME10"
                defaultValue={initialData?.code}
                required
                className="uppercase"
                disabled={mode === "edit"}
              />
              <p className="text-xs text-muted-foreground">
                Will be automatically converted to uppercase
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exp_date">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="exp_date"
                name="exp_date"
                type="date"
                defaultValue={
                  initialData?.exp_date
                    ? new Date(initialData.exp_date).toISOString().split("T")[0]
                    : ""
                }
                min={minDate}
                required
              />
            </div>
          </div>

          {mode === "edit" && (
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="is_active" name="is_active" defaultChecked={initialData?.is_active} />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active Status
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discount Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">
                Discount Type <span className="text-red-500">*</span>
              </Label>
              <Select
                name="type"
                defaultValue={initialData?.type || "percentage"}
                onValueChange={(value) => setDiscountType(value as "number" | "percentage")}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="number">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                Discount Value <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={discountType === "percentage" ? "e.g., 10" : "e.g., 100"}
                  defaultValue={initialData?.value}
                  className={discountType === "number" ? "pl-8" : ""}
                  required
                />
                {discountType === "number" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                )}
                {discountType === "percentage" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {discountType === "percentage"
                  ? "Percentage discount (0-100)"
                  : "Fixed amount discount in rupees"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_limit">Minimum Order Amount</Label>
              <div className="relative">
                <Input
                  id="min_order_limit"
                  name="min_order_limit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 500"
                  defaultValue={initialData?.min_order_limit}
                  className="pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Leave empty for no minimum</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope & Restrictions - Admin Only */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Scope & Restrictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scope">
                  Scope <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="scope"
                  value={selectedScope}
                  onValueChange={(value) => setSelectedScope(value as "vendor" | "global")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Vendors)</SelectItem>
                    <SelectItem value="vendor">Vendor Specific</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Global: Applies to entire order | Vendor: Applies to specific vendor products
                </p>
              </div>

              {selectedScope === "vendor" && (
                <div className="space-y-2">
                  <Label htmlFor="vendorId">
                    Vendor ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vendorId"
                    name="vendorId"
                    placeholder="Enter vendor ID"
                    defaultValue={
                      typeof initialData?.vendorId === "string"
                        ? initialData.vendorId
                        : initialData?.vendorId?._id
                    }
                    required={selectedScope === "vendor"}
                  />
                  <p className="text-xs text-muted-foreground">Enter the specific vendor's ID</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Total Usage Limit</Label>
              <Input
                id="usage_limit"
                name="usage_limit"
                type="number"
                min="1"
                placeholder="e.g., 100"
                defaultValue={initialData?.usage_limit}
              />
              <p className="text-xs text-muted-foreground">
                Maximum total times this coupon can be used (all users)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_usage_limit">Per User Usage Limit</Label>
              <Input
                id="user_usage_limit"
                name="user_usage_limit"
                type="number"
                min="1"
                placeholder="e.g., 2"
                defaultValue={initialData?.user_usage_limit}
              />
              <p className="text-xs text-muted-foreground">
                Maximum times a single user can use this coupon
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Leave empty for unlimited usage</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Coupon" : "Update Coupon"}
        </Button>
      </div>
    </form>
  );
}
