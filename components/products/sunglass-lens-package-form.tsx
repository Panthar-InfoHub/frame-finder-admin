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

import { normalizeObject } from "@/utils/helpers";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ImageUploader } from "../ui/custom/ImageUploader";
import { ImageSection } from "../ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "lens-packages" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

const SunglassLensPackageForm = () => {
  const colors = ["zed black", "grey tinted", "blue tinted", "yellow tinted"];

  const lensDesigns = ["single vision", "bifocal", "progressive"];

  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = normalizeObject(Object.fromEntries(formData.entries()));
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
            <Label htmlFor="brandName">Company</Label>
            <Input id="brandName" required name="brand_name" placeholder="Enter brand name" />
          </div>
          <div>
            <Label htmlFor="quantity">Index</Label>
            <Input
              id="quantity"
              type="number"
              name="quantity"
              required
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <Label htmlFor="design">Design</Label>
            <MultiSelect name="design">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select Design" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {lensDesigns.map((design: any) => (
                  <MultiSelectItem key={design} value={design}>
                    {design}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div>
            <Label htmlFor="gender">Lens Type</Label>
            <MultiSelect name="lensType">
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select Type" />
              </MultiSelectTrigger>
              <MultiSelectContent search={false}>
                {colors.map((color: any) => (
                  <MultiSelectItem key={color} value={color}>
                    {color}
                  </MultiSelectItem>
                ))}
              </MultiSelectContent>
            </MultiSelect>
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
            <Label htmlFor="basePrice">Basic Price</Label>
            <Input
              id="basePrice"
              type="number"
              name="base_price"
              required
              placeholder="Enter basic price"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default SunglassLensPackageForm;
