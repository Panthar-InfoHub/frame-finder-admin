"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/custom/multi-select";
import { createFrameAction } from "@/actions/vendors/products";

import { z } from "zod";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { getSignedViewUrl } from "@/actions/cloud/storage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputTags } from "@/components/ui/custom/InputTags";
import { Textarea } from "@/components/ui/textarea";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/form-data";
import { useRouter } from "next/navigation";

const FrameSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  frame_color: z.array(z.string()).min(1, "Add at least one frame color"),
  temple_color: z.array(z.string()).min(1, "Add at least one temple color"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  // mrp: z.coerce.number().positive("MRP must be positive"),
  // base_price: z.coerce.number().positive("Base price must be positive"),
  // shipping_price: z.coerce.number().min(0, "Shipping price cannot be negative"),
  price: z.coerce.number().positive("Total price must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  min_quantity: z.coerce.number().optional(),
  max_quantity: z.coerce.number().optional(),
  // images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});
export type FrameFormData = z.infer<typeof FrameSchema>;

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

export default function AddFrameForm() {
  const genders = ["male", "female", "kids", "unisex"];
  const sizes = ["S", "M", "L", "XL"];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState({
    basePrice: "",
    shippingPrice: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const imagesData = images.map((url) => ({ url }));
    formdata.append("images", JSON.stringify(imagesData));

    const result = FrameSchema.safeParse(normalizeObject(formdata, ["hsn_code"]));
    if (!result.success) {
      toast.error(result.error.issues[0].message || "Invalid form data");
      return;
    }
    startTransition(async () => {
      const resp = await createFrameAction(result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to create product");
        return;
      }
      toast.success("Product created successfully");
      router.push("/dashboard/products");
    });
  };

  async function fetchOptions() {
    try {
      const resp = await getFrameFormData();
      const formatted: Record<string, string[]> = {};

      resp.data.forEach((item: { type: string; values: string[] }) => {
        formatted[item.type] = item.values;
      });

      console.log(formatted);

      setOptions(formatted);
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add New Frame</h2>

      <form onSubmit={handleSubmit} className="space-y-4 [&_label]:mb-1 ">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Frame Images</h3>
              <p className="text-sm text-muted-foreground">
                {images.length > 0
                  ? `${images.length} image${images.length === 1 ? "" : "s"} added`
                  : "No images uploaded"}
              </p>
            </div>
            <ImageUploader
              images={images}
              onChange={setImages}
              uploadFunction={ImageUploadFunction}
            />
          </CardHeader>
          {images.length > 0 && (
            <CardContent>
              <ImageSection images={images} onChange={setImages} getSignedUrl={getSignedViewUrl} />
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input id="brandName" required name="brand_name" placeholder="Enter brand name" />
          </div>
          <div className="col-span-1 md:col-span-2 xl:col-span-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              required
              name="desc"
              placeholder="Enter product description"
            />
          </div>
          <div className="col-span-1 md:col-span-2 xl:col-span-3 flex gap-4 w-full flex-wrap ">
            <div className="flex-1">
              <Label htmlFor="frameColor">Frame Color</Label>
              <InputTags
                name="frame_color"
                required
                placeholder="Enter frame color"
                emptyMessage="No frame color added"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="templeColor">Temple Color</Label>
              <InputTags
                name="temple_color"
                required
                placeholder="Enter temple color"
                emptyMessage="No temple color added"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              name="quantity"
              required
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <Label htmlFor="min-quantity">Minimum Quantity</Label>
            <Input
              id="min-quantity"
              type="number"
              defaultValue={5}
              name="min_quantity"
              placeholder="Enter minimum quantity"
            />
          </div>
          <div>
            <Label htmlFor="max-quantity">Maximum Quantity</Label>
            <Input
              id="max_quantity"
              type="number"
              defaultValue={100}
              placeholder="Enter maximum quantity"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <MultiSelect name="gender">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select gender" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {genders.map((gender) => (
                  <MultiSelectItem key={gender} value={gender}>
                    {gender}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <MultiSelect name="material">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select material" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {options?.material?.length > 0 &&
                  options?.material?.map((material) => (
                    <MultiSelectItem key={material} value={material}>
                      {material}
                    </MultiSelectItem>
                  ))}
                <div className="p-2 border-t ">
                  <AddValueDialog type="material" />
                </div>
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="shape">Shape</Label>
            <MultiSelect name="shape">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select shape" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {options?.shape?.length > 0 &&
                  options?.shape?.map((shape) => (
                    <MultiSelectItem key={shape} value={shape}>
                      {shape}
                    </MultiSelectItem>
                  ))}
                <MultiSelectItem value="dummy">Dummy</MultiSelectItem>
                <div className="p-2 border-t ">
                  <AddValueDialog type="shape" />
                </div>
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="style">Style</Label>
            <MultiSelect name="style">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select style" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {options?.style?.map((style) => (
                  <MultiSelectItem key={style} value={style}>
                    {style}
                  </MultiSelectItem>
                ))}
                <MultiSelectItem value="dummy">Dummy</MultiSelectItem>
                <div className="p-2 border-t ">
                  <AddValueDialog type="style" />
                </div>
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="size">Size</Label>
            <MultiSelect name="sizes">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select size" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {sizes.map((size) => (
                  <MultiSelectItem key={size} value={size}>
                    {size}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="hsnSacCode">HSN/SAC Code</Label>
            <Input id="hsnSacCode" name="hsn_code" required placeholder="Enter HSN/SAC code" />
          </div>
          <div>
            <Label htmlFor="Mrp">MRP</Label>
            <Input id="Mrp" type="number" name="mrp" required placeholder="Enter MRP" />
          </div>
          <div>
            <Label htmlFor="basePrice">Base Price</Label>
            <Input
              id="basePrice"
              type="number"
              name="base_price"
              value={price.basePrice}
              required
              onChange={(e) => setPrice({ ...price, basePrice: e.target.value })}
              placeholder="Enter base price"
            />
          </div>
          <div>
            <Label htmlFor="shippingPrice">Shipping Price</Label>
            <Input
              id="shippingPrice"
              value={price.shippingPrice}
              name="shipping_price"
              required
              type="number"
              placeholder="Enter shipping price"
              onChange={(e) => setPrice({ ...price, shippingPrice: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="totalPrice">Total Price</Label>
            <Input
              id="totalPrice"
              name="price"
              required
              readOnly
              value={parseFloat(price.basePrice || "0") + parseFloat(price.shippingPrice || "0")}
              type="number"
              placeholder="Total price"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
