import React, { useTransition } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { addVendorMiscValues } from "@/actions/Vendor Misc/addVendorMiscValues";
import { toast } from "sonner";

const AddValueDialog = ({
  type,
  btnText = "Add Value",
  btnClassName,
  children,
}: {
  type: string;
  btnText?: string;
  btnClassName?: string;
  children?: React.ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const value = formData.get(`${type}-value`) as string;


    startTransition(async () => {
      const resp = await addVendorMiscValues({ type, values: [value] });
      if (!resp.success) {
        toast.error(`Failed to add value: ${resp.message}`);
        return;
      }
      console.log("Add value response:", resp);
      toast.success("Value added successfully");
      setIsOpen(false);
    });
  };

  return (
    <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className={` w-full ${btnClassName}`} type="button">
            {btnText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm!">
        <DialogHeader className="p-2 text-center!">
          <DialogTitle className="capitalize">Add new value of {type}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input id={`${type}-value`} name={`${type}-value`} placeholder={`Enter ${type} value`} />
          <Button className="self-center px-6" disabled={isPending}>
            {isPending ? "Adding..." : "Add Value"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddValueDialog;
