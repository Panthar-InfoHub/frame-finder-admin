"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Glasses, Sun, Eye } from "lucide-react";

const Products = [
  { name: "Frame", icon: Glasses, type: "frame" },
  { name: "Sunglass", icon: Sun, type: "sunglass" },
];

export default function AddLensPackageDialog() {
  const router = useRouter();


  const handleSelect = (type: string) => {
    router.push(`lens-packages/add-lens-package?type=${type}`);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-fit 
        self-end"
        >
          Add Lens Package
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl  p-6">
        <DialogHeader className="pb-4 text-center!">
          <DialogTitle className="text-xl font-bold">Add Lens Package</DialogTitle>
          <DialogDescription className="text-sm text-foreground font-semibold ">
            Select lens package you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          {Products.map(({ type, name, icon: Icon }) => {
            return (
              <div
                key={type}
                onClick={() => handleSelect(type)}
                className="flex flex-col items-center justify-center gap-3 w-full p-5 bg-white rounded-2xl shadow hover:shadow-lg group border border-gray-200 transition-all cursor-pointer"
              >
                <div
                  className="p-4 bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all
                   rounded-full flex items-center justify-center"
                >
                  <Icon className="h-6 w-6 " />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm">{name}</h3>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
