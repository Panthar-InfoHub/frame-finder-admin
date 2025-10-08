"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAccessoryStock } from "@/actions/vendors/products";
import { ProductType } from "@/types/products";

interface StockUpdateDialogProps {
  children: React.ReactNode;
  productId: string;
  currentStock: number;
  productType: ProductType;
  minStock?: number;
}

export function StockUpdateDialog({
  children,
  productId,
  currentStock,
  productType,
  minStock = 5,
}: StockUpdateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const OPTIONS = [
    {
      value: "increase",
      label: "INCREASE",
    },
    {
      value: "decrease",
      label: "DECREASE",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("addStock"));
    const operation = formData.get("operation") as "increase" | "decrease";

    if (!quantity || !operation) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    let result;

    // Handle different product types
    if (productType === "accessories") {
      result = await updateAccessoryStock(productId, operation, quantity);
    } else {
      toast.error("Stock update not supported for this product type");
      setLoading(false);
      return;
    }

    if (result.success) {
      toast.success("Stock updated successfully");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update stock");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Stock</DialogTitle>
          <DialogDescription>Update stock levels for this product</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentStock">Current Stock </Label>
            <Input
              id="currentStock"
              name="currentStock"
              type="number"
              min="0"
              disabled={true}
              defaultValue={currentStock}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addStock">
              Quantity <span className="text-red-500">*</span>
            </Label>
            <Input id="addStock" name="addStock" type="number" min="1" defaultValue={1} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operation">
              Operation <span className="text-red-500">*</span>
            </Label>
            <Select name="operation" required>
              <SelectTrigger>
                <SelectValue placeholder="Select Operation" />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumStock">Minimum Stock</Label>
            <Input
              id="minimumStock"
              name="minimumStock"
              type="number"
              disabled={true}
              min="0"
              defaultValue={minStock}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
