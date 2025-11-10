"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLensSolutionStockAction } from "@/actions/vendors/products";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LensSolutionStockUpdateDialogProps {
  productId: string;
  variantId: string;
  currentStock: number;
  children: React.ReactNode;
}

export default function LensSolutionStockUpdateDialog({
  productId,
  variantId,
  currentStock,
  children,
}: LensSolutionStockUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState<"increase" | "decrease">("increase");
  const [quantity, setQuantity] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (operation === "decrease" && quantity > currentStock) {
      toast.error("Cannot decrease more than current stock");
      return;
    }

    startTransition(async () => {
      const response = await updateLensSolutionStockAction(
        productId,
        variantId,
        operation,
        quantity
      );
      if (response.success) {
        toast.success(response.message);
        setOpen(false);
        setQuantity(0);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    });
  };

  const newStock =
    operation === "increase" ? currentStock + quantity : Math.max(0, currentStock - quantity);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Current stock: <span className="font-semibold">{currentStock} units</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <select
                id="operation"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={operation}
                onChange={(e) => setOperation(e.target.value as "increase" | "decrease")}
                disabled={isPending}
              >
                <option value="increase">Increase Stock</option>
                <option value="decrease">Decrease Stock</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
                required
                disabled={isPending}
              />
            </div>

            {quantity > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">New stock will be:</p>
                <p className="text-2xl font-bold">{newStock} units</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
