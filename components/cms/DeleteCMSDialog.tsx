"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CMSEntry, CMS_KEY_OPTIONS } from "@/types/cms";
import { useState } from "react";
import { toast } from "sonner";
import { deleteCMSEntry } from "@/actions/cms";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DeleteCMSDialogProps {
  entry: CMSEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCMSDialog({ entry, open, onOpenChange }: DeleteCMSDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const getKeyLabel = (key: string) => {
    const option = CMS_KEY_OPTIONS.find((opt) => opt.value === key);
    return option?.label || key;
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const result = await deleteCMSEntry(entry._id);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting CMS entry:", error);
      toast.error("An error occurred while deleting the CMS entry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete CMS Entry</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the CMS entry for{" "}
            <span className="font-semibold">{getKeyLabel(entry.key)}</span>?
            <br />
            <br />
            This action cannot be undone. All content items and images associated with this entry
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
