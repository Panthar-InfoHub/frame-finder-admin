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
import { createSunglassAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputTags } from "@/components/ui/custom/InputTags";
import { Textarea } from "@/components/ui/textarea";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/vendors/form-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation";
import { SunglassSchema } from "@/lib/validations";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "sunglasses" },
  });
  toast.success(`${success.length} images uploaded successfully`);
  if (failed.length) {
    toast.error(`${failed.length} images failed to upload`);
  }
  return success.map((item) => item.path);
};

export default function AddSunglassesForm() {
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

    const result = SunglassSchema.safeParse(normalizeObject(formdata, ["hsn_code"]));
    if (!result.success) {
      toast.error(result.error.issues[0].message || "Invalid form data");
      return;
    }

    startTransition(async () => {
      const resp = await createSunglassAction(result.data);
      if (!resp.success) {
        toast.success(resp.message || "Failed to create product");
        return;
      }
      toast.success("Product created successfully");
      router.push("/dashboard/products/sunglasses");
    });
  };

  async function fetchOptions() {
    try {
      const resp = await getFrameFormData();
      const formatted: Record<string, string[]> = {};
      resp.data.forEach((item: { type: string; values: string[] }) => {
        formatted[item.type] = item.values;
      });

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
      <h2 className="text-xl font-semibold">Add New Sunglasses</h2>

      <form onSubmit={handleSubmit} className="space-y-4 [&_label]:mb-1 ">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sunglasses Images</h3>
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
            <div className="flex-1">
              <Label htmlFor="lensColor">Lens Color</Label>
              <InputTags
                name="lens_color"
                required
                placeholder="Enter lens color"
                emptyMessage="No lens color added"
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
            <Label htmlFor="is_power">Do you Provide Powered Prescribed Lens</Label>
            <Select name="is_power" defaultValue="false">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select powered prescribed lens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"true"}>Yes</SelectItem>
                <SelectItem value={"false"}>No</SelectItem>
              </SelectContent>
            </Select>
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
                  <AddValueDialog type="material" onValueAdded={fetchOptions} />
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

                <div className="p-2 border-t ">
                  <AddValueDialog type="shape" onValueAdded={fetchOptions} />
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
                <div className="p-2 border-t ">
                  <AddValueDialog type="style" onValueAdded={fetchOptions} />
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
