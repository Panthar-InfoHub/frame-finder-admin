"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteFrameLensPackage, deleteSunglassLensPackage } from "@/actions/vendors/lens-package";

interface DeleteLensPackageButtonProps {
  id: string;
  type: "frames" | "sunglasses";
  productCode: string;
}

export function DeleteLensPackageButton({ id, type, productCode }: DeleteLensPackageButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    const deleteFunction = type === "frames" ? deleteFrameLensPackage : deleteSunglassLensPackage;

    const result = await deleteFunction(id);

    if (result.success) {
      toast.success("Lens package deleted successfully");
      setOpen(false);
      router.push(`/dashboard/lens-packages/${type}`);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete lens package");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Delete Lens Package</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the lens package{" "}
            <span className="font-mono font-semibold">{productCode}</span>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
