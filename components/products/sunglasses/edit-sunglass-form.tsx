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
import { updateSunglassAction, getSunglassById } from "@/actions/vendors/products";

import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/vendors/form-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { SunglassSchema, SunglassVariantType } from "@/lib/validations";
import SunglassVariantManager from "@/components/products/sunglasses/SunglassVariantManager";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "sunglasses" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface EditSunglassFormProps {
  sunglassId: string;
}

export default function EditSunglassForm({ sunglassId }: EditSunglassFormProps) {
  const genders = ["male", "female", "kids", "unisex"];
  const sizes = ["S", "M", "L", "XL"];

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variants, setVariants] = useState<SunglassVariantType[]>([
    {
      frame_color: [],
      temple_color: [],
      lens_color: [],
      price: 0,
      images: [],
    },
  ]);

  // Form state for pre-filled data
  const [formData, setFormData] = useState({
    brand_name: "",
    desc: "",
    material: [] as string[],
    shape: [] as string[],
    style: [] as string[],
    hsn_code: "",
    sizes: [] as string[],
    gender: [] as string[],
    is_power: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate variants first
    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    const formdata = new FormData(e.currentTarget);

    // Get basic form data and normalize it properly
    const basicData = normalizeObject(formdata, ["hsn_code"]);

    // Prepare the complete data structure (without stock for edit)
    const completeData = {
      ...basicData,
      variants: variants,
    };

    // For edit, we can use a modified schema that doesn't require stock
    const editSchema = SunglassSchema.omit({ stock: true });
    const result = editSchema.safeParse(completeData);

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
      const resp = await updateSunglassAction(sunglassId, result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to update product");
        return;
      }
      toast.success("Product updated successfully");
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

  async function fetchSunglassData() {
    try {
      const resp = await getSunglassById(sunglassId);
      if (!resp.success) {
        toast.error("Failed to load sunglass data");
        router.push("/dashboard/products/sunglasses");
        return;
      }

      const sunglassData = resp.data;

      // Set form data
      setFormData({
        brand_name: sunglassData.brand_name || "",
        desc: sunglassData.desc || "",
        material: sunglassData.material || [],
        shape: sunglassData.shape || [],
        style: sunglassData.style || [],
        hsn_code: sunglassData.hsn_code || "",
        sizes: sunglassData.sizes || [],
        gender: sunglassData.gender || [],
        is_power: sunglassData.is_power || false,
      });

      // Set variants data
      if (sunglassData.variants && sunglassData.variants.length > 0) {
        const transformedVariants = sunglassData.variants.map((variant: any) => ({
          frame_color: variant.frame_color || [],
          temple_color: variant.temple_color || [],
          lens_color: variant.lens_color || [],
          price: variant.price?.mrp || variant.price?.base_price || 0,
          images: variant.images || [],
        }));
        setVariants(transformedVariants);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch sunglass data", err);
      toast.error("Failed to load sunglass data");
      router.push("/dashboard/products/sunglasses");
    }
  }

  useEffect(() => {
    fetchOptions();
    fetchSunglassData();
  }, [sunglassId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading sunglass data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Sunglasses</h2>

      <form onSubmit={handleSubmit} className="space-y-6 [&_label]:mb-1">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  required
                  name="brand_name"
                  placeholder="Enter brand name"
                  defaultValue={formData.brand_name}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  name="desc"
                  placeholder="Enter product description"
                  defaultValue={formData.desc}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Details</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <MultiSelect name="gender" defaultValues={formData.gender}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select gender" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {[...genders, ...formData.gender].map((gender) => (
                      <MultiSelectItem key={gender} value={gender}>
                        {gender}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <MultiSelect name="material" defaultValues={formData.material}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select material" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.material?.length > 0 &&
                      [...options.material, ...formData.material].map((material) => (
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
                <MultiSelect name="shape" defaultValues={formData.shape}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select shape" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.shape?.length > 0 &&
                      [...options.shape, ...formData.shape].map((shape) => (
                        <MultiSelectItem key={shape} value={shape}>
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
                <MultiSelect name="style" defaultValues={formData.style}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select style" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {[...options.style, ...formData.style].map((style) => (
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
                <Label htmlFor="size">Size</Label>
                <MultiSelect name="sizes" defaultValues={formData.sizes}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select size" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {[...sizes, ...formData.sizes].map((size) => (
                      <MultiSelectItem key={size} value={size}>
                        {size}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="hsnSacCode">HSN/SAC Code</Label>
                <Input
                  id="hsnSacCode"
                  name="hsn_code"
                  required
                  placeholder="Enter HSN/SAC code"
                  defaultValue={formData.hsn_code}
                />
              </div>

              <div>
                <Label htmlFor="is_power">Provide Powered Prescribed Lens</Label>
                <Select name="is_power" defaultValue={formData.is_power ? "true" : "false"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select powered prescribed lens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Management */}
        <SunglassVariantManager
          variants={variants}
          onVariantsChange={setVariants}
          uploadFunction={ImageUploadFunction}
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Sunglasses"}
          </Button>
        </div>
      </form>
    </div>
  );
}
