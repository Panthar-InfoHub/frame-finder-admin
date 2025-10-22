"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order, UpdateOrderData } from "@/types/order";
import { updateOrderStatus } from "@/actions/orders";
import { Eye, Edit, Loader2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { toast } from "sonner";

interface OrderTableActionsProps {
  order: Order;
}

export function OrderTableActions({ order }: OrderTableActionsProps) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<UpdateOrderData>({
    order_status: order.order_status,
    tracking_id: order.tracking_id || "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const result = await updateOrderStatus(order._id, formData);

      if (result.success) {
        toast.success("Order updated successfully!");
        setIsUpdateOpen(false);
      } else {
        toast.error(result.message || "Failed to update order");
      }
    } catch (error) {
      toast.error("An error occurred while updating the order");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Update Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Order Details Modal */}
      <OrderDetailsModal
        orderId={isViewOpen ? order._id : null}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Update Order Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order</DialogTitle>
            <DialogDescription>
              Update order status and tracking information for order {order.orderCode}
            </DialogDescription>
          </DialogHeader>


          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderStatus">Order Status</Label>
              <Select
                value={formData.order_status}
                onValueChange={(value: any) => setFormData({ ...formData, order_status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking_id">Tracking ID</Label>
              <Input
                id="tracking_id"
                value={formData.tracking_id || ""}
                onChange={(e) => setFormData({ ...formData, tracking_id: e.target.value })}
                placeholder="Enter tracking ID"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
