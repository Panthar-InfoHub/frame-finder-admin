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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { normalizeObject } from "@/utils/helpers";
import { getFrameFormData } from "@/actions/vendors/form-data";
import { useRouter } from "next/navigation";
import { FrameSchema, FrameVariantType } from "@/lib/validations";
import FramesVariantManager from "@/components/products/frames/FramesVariantManager";
import { BackButton } from "@/components/ui/back-button";
import { Switch } from "@/components/ui/switch";

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
  const [isPower, setIsPower] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variants, setVariants] = useState<FrameVariantType[]>([
    {
      frame_color: "",
      temple_color: "",
      price: {
        base_price: 0,
        mrp: 0,
        shipping_price: {
          custom: false,
          value: 100,
        },
        total_price: 100,
      },
      stock: {
        current: 0,
        minimum: 5,
      },
      images: [],
    },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate variants first
    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    const formdata = new FormData(e.currentTarget);

    // Get basic form data and normalize it properly
    const basicData = normalizeObject(formdata, ["hsn_code", "productCode"]);

    // Extract dimension data from form fields
    const dimension = {
      lens_width: basicData.lens_width as string,
      bridge_width: basicData.bridge_width as string,
      temple_length: basicData.temple_length as string,
      lens_height: basicData.lens_height as string,
    };

    // Remove dimension fields from basicData to avoid duplication
    delete basicData.lens_width;
    delete basicData.bridge_width;
    delete basicData.temple_length;
    delete basicData.lens_height;

    // Prepare the complete data structure
    const completeData = {
      ...basicData,
      dimension,
      is_power: isPower,
      variants: variants,
    };

    const result = FrameSchema.safeParse(completeData);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        })
        .join("\n");
      toast.error(`Validation failed:\n${errorMessages}`);
      return;
    }

    startTransition(async () => {
      const resp = await createFrameAction(result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to create product");
        return;
      }
      toast.success("Product created successfully");
      router.push("/dashboard/products/frames");
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
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/products/frames">Back to Frames</BackButton>
        <h2 className="text-xl font-semibold">Add New Frame</h2>
        <div></div> {/* Empty div for spacing */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 [&_label]:mb-1">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  required
                  name="productCode"
                  placeholder="Enter product code"
                />
              </div>
              <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" required name="brand_name" placeholder="Enter brand name" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Specifications</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                      options?.shape?.map((shape ,i) => (
                        <MultiSelectItem key={`-${i}`} value={shape}>
                          {shape}
                        </MultiSelectItem>
                      ))}
                    
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
                      <MultiSelectItem key={size} value={size} className="capitalize">
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPower"
                  checked={isPower}
                  onCheckedChange={(checked) => setIsPower(checked as boolean)}
                />
                <Label htmlFor="isPower" className="cursor-pointer">
                  Power Frame (Supports Power Lenses)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frame Dimensions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Frame Dimensions</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dimension Reference Image */}
            <div className="flex justify-center mb-6">
              <div className=" w-full">
                <img
                  src="/placeholders/frames-sizes.png"
                  alt="Frame Dimensions Reference"
                  className="w-full h-auto border rounded-lg bg-gray-50"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Reference guide for frame measurements
                </p>
              </div>
            </div>

            {/* Dimension Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="lensWidth">Lens Width (mm)</Label>
                <Input
                  id="lensWidth"
                  name="lens_width"
                  required
                  placeholder="e.g., 50"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="bridgeWidth">Bridge Width (mm)</Label>
                <Input
                  id="bridgeWidth"
                  name="bridge_width"
                  required
                  placeholder="e.g., 21"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="templeLength">Temple Length (mm)</Label>
                <Input
                  id="templeLength"
                  name="temple_length"
                  required
                  placeholder="e.g., 145"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="lensHeight">Lens Height (mm)</Label>
                <Input
                  id="lensHeight"
                  name="lens_height"
                  required
                  placeholder="e.g., 35"
                  type="number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Management */}
        <FramesVariantManager
          variants={variants}
          onVariantsChange={setVariants}
          uploadFunction={ImageUploadFunction}
          isCreate
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
