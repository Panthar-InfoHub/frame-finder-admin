"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { normalizeObject } from "@/utils/helpers";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ImageUploader } from "../ui/custom/ImageUploader";
import { ImageSection } from "../ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { SunglassLensPackageSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { createSunglassLensPackage } from "@/actions/vendors/lens-package";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "lens-packages" },
  });
  if (failed.length > 0) {
    toast.error(`${failed.length} file(s) failed to upload.`);
  } else {
    toast.success(`${success.length} file(s) uploaded successfully.`);
  }

  return success.map((item) => item.path);
};

const SunglassLensPackageForm = () => {
  const colors = ["zed black", "grey tinted", "blue tinted", "yellow tinted"];

  const lensDesigns = ["single vision", "bifocal", "progressive"];

  const [images, setImages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
      const imagesData = images.map((url) => ({ url }));
    formData.append("images", JSON.stringify(imagesData));
    const data = normalizeObject(Object.fromEntries(formData.entries()));

    const result = SunglassLensPackageSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message || "Invalid form data");
      return;
    }
    startTransition(async () => {
      const resp = await createSunglassLensPackage(result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to create product");
        return;
      }
      toast.success("Product created successfully");
      router.push("/dashboard/lens-packages/sunglasses");
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sunglass Lens Package</h2>

      <form onSubmit={handleSubmit} className="space-y-4 [&_label]:mb-1 ">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Sunglass Package Images</h3>
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

        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-
        2 gap-4"
        >
          <div className="">
            <Label htmlFor="company">Company</Label>
            <Input id="company" required name="company" placeholder="Enter company name" />
          </div>
          <div>
            <Label htmlFor="index">Index</Label>
            <Input id="index" type="number" name="index" required placeholder="Enter index value" />
          </div>

          <div>
            <Label htmlFor="package_design">Design</Label>
            <Select name="package_design">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Design" />
              </SelectTrigger>
              <SelectContent>
                {lensDesigns.map((design: any) => (
                  <SelectItem key={design} value={design}>
                    {design}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lens_color">Lens Color</Label>
            <Select name="lens_color">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color: any) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="min_quantity">Min Quantity</Label>
            <Input
              id="min_quantity"
              type="number"
              name="min_quantity"
              required
              placeholder="Enter min quantity"
            />
          </div>
          <div>
            <Label htmlFor="max_quantity">Max Quantity</Label>
            <Input
              id="max_quantity"
              type="number"
              name="max_quantity"
              required
              placeholder="Enter max quantity"
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              name="price"
              required
              placeholder="Enter Package price"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isPending}>{isPending ? "Submitting..." : "Submit"}</Button>
        </div>
      </form>
    </div>
  );
};

export default SunglassLensPackageForm;
