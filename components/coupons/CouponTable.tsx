"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Coupon } from "@/types/coupon";
import { useState } from "react";
import { CouponDetailsDialog } from "./CouponDetailsDialog";
import { DeleteCouponDialog } from "./DeleteCouponDialog";
import { useRouter } from "next/navigation";

interface CouponTableProps {
  coupons: Coupon[];
}

export function CouponTable({ coupons }: CouponTableProps) {
  const router = useRouter();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!coupons || coupons.length === 0) {
    return <div className="text-center text-gray-500 text-sm mt-6">No coupons found.</div>;
  }

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setViewDialogOpen(true);
  };

  const handleEdit = (couponId: string) => {
    router.push(`/dashboard/coupons/${couponId}/edit`);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% OFF`;
    }
    return `₹${coupon.value} OFF`;
  };

  const isExpired = (expDate: string) => {
    return new Date(expDate) < new Date();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead>Min. Order</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon._id}>
              <TableCell>
                <span className="font-mono font-semibold text-sm">{coupon.code}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium">
                  {getDiscountDisplay(coupon)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={coupon.scope === "global" ? "default" : "outline"}>
                  {coupon.scope}
                </Badge>
              </TableCell>
              <TableCell>{coupon.min_order_limit ? `₹${coupon.min_order_limit}` : "-"}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Total: {coupon.usage_limit || "Unlimited"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Per User: {coupon.user_usage_limit || "Unlimited"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`text-sm ${
                    isExpired(coupon.exp_date) ? "text-red-500 font-medium" : ""
                  }`}
                >
                  {new Date(coupon.exp_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </TableCell>
              <TableCell>
                {isExpired(coupon.exp_date) ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : coupon.is_active ? (
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(coupon)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(coupon._id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(coupon)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCoupon && (
        <>
          <CouponDetailsDialog
            coupon={selectedCoupon}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <DeleteCouponDialog
            coupon={selectedCoupon}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
