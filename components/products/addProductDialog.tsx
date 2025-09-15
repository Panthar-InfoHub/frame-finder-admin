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
  { name: "Frames", icon: Glasses, type: "frames" },
  { name: "Sunglasses", icon: Sun, type: "sunglasses" },
  { name: "Contact Lens", icon: Eye, type: "contact-lens" },
];

export default function AddProductDialog() {
  const router = useRouter();


  const handleSelect = (type: string) => {
    router.push(`products/add-product?type=${type}`);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-fit 
        self-end"
        >
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl  p-6">
        <DialogHeader className="pb-4 text-center!">
          <DialogTitle className="text-xl font-bold">Add Product</DialogTitle>
          <DialogDescription className="text-sm text-foreground font-semibold ">
            Select the type of product you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-col-1 md:grid-cols-3 gap-4">
          {Products.map(({ type, name, icon: Icon }) => {
            return (
              <div
                key={type}
                onClick={() => handleSelect(type)}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-2xl shadow hover:shadow-lg group border border-gray-200 transition-all cursor-pointer"
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
