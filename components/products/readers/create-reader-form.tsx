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
import { createReaderAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/vendors/form-data";
import { useRouter } from "next/navigation";
import { ReaderSchema, ReaderVariantType } from "@/lib/validations";
import ReadersVariantManager from "@/components/products/readers/ReadersVariantManager";
import { BackButton } from "@/components/ui/back-button";
import { Loader2 } from "lucide-react";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

export default function AddReaderForm() {
  const genders = ["male", "female", "kids", "unisex"];
  const sizes = ["S", "M", "L", "XL"];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variants, setVariants] = useState<ReaderVariantType[]>([
    {
      frame_color: "",
      temple_color: "",
      lens_color: "",
      power: [],
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
      variants: variants,
    };

    const result = ReaderSchema.safeParse(completeData);
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
      const resp = await createReaderAction(result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to create reader glass");
        return;
      }
      toast.success("Reader glass created successfully");
      router.push("/dashboard/products/readers");
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
        <BackButton href="/dashboard/products/readers">Back to Readers</BackButton>
        <h2 className="text-xl font-semibold">Add New Reader Glass</h2>
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
                  name="productCode"
                  placeholder="RD001"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  placeholder="Ray-Ban Reader Classic"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="hsn_code">HSN/SAC Code</Label>
                <Input
                  id="hsn_code"
                  name="hsn_code"
                  placeholder="9004.10.00"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <MultiSelect name="material">
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select materials" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.material?.length > 0 &&
                      options?.material?.map((material) => (
                        <MultiSelectItem key={material} value={material}>
                          {material}
                        </MultiSelectItem>
                      ))}
                    <div className="p-2 border-t">
                      <AddValueDialog type="material" onValueAdded={fetchOptions} />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="shape">Shape</Label>
                <MultiSelect name="shape">
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select shapes" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.shape?.length > 0 &&
                      options?.shape?.map((shape, i) => (
                        <MultiSelectItem key={`shape-${i}`} value={shape}>
                          {shape}
                        </MultiSelectItem>
                      ))}
                    <div className="p-2 border-t">
                      <AddValueDialog type="shape" onValueAdded={fetchOptions} />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <MultiSelect name="style">
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select styles" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.style?.length > 0 &&
                      options?.style?.map((style) => (
                        <MultiSelectItem key={style} value={style}>
                          {style}
                        </MultiSelectItem>
                      ))}
                    <div className="p-2 border-t">
                      <AddValueDialog type="style" onValueAdded={fetchOptions} />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="sizes">Sizes</Label>
                <MultiSelect name="sizes">
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select sizes" />
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
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Dimensions</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="lens_width">Lens Width (mm)</Label>
                <Input
                  id="lens_width"
                  type="number"
                  name="lens_width"
                  placeholder="50"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="bridge_width">Bridge Width (mm)</Label>
                <Input
                  id="bridge_width"
                  type="number"
                  name="bridge_width"
                  placeholder="18"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="temple_length">Temple Length (mm)</Label>
                <Input
                  id="temple_length"
                  type="number"
                  name="temple_length"
                  placeholder="140"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="lens_height">Lens Height (mm)</Label>
                <Input
                  id="lens_height"
                  type="number"
                  name="lens_height"
                  placeholder="35"
                  required
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <ReadersVariantManager
          variants={variants}
          onVariantsChange={setVariants}
          uploadFunction={ImageUploadFunction}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products/readers")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Reader"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
