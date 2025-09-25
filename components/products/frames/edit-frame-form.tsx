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
import { updateFrameAction, getFrameById } from "@/actions/vendors/products";

import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/vendors/form-data";
import { useRouter } from "next/navigation";
import { FrameSchema, FrameVariantType } from "@/lib/validations";
import FramesVariantManager from "@/components/products/frames/FramesVariantManager";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface EditFrameFormProps {
  frameId: string;
}

export default function EditFrameForm({ frameId }: EditFrameFormProps) {
  const genders = ["male", "female", "kids", "unisex"];
  const sizes = ["S", "M", "L", "XL"];

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variants, setVariants] = useState<FrameVariantType[]>([
    {
      frame_color: [],
      temple_color: [],
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
    const editSchema = FrameSchema.omit({ stock: true });
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
      const resp = await updateFrameAction(frameId, result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to update product");
        return;
      }
      toast.success("Product updated successfully");
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

  async function fetchFrameData() {
    try {
      const resp = await getFrameById(frameId);
      if (!resp.success) {
        toast.error("Failed to load frame data");
        router.push("/dashboard/products/frames");
        return;
      }

      const frameData = resp.data;

      // Set form data
      setFormData({
        brand_name: frameData.brand_name || "",
        desc: frameData.desc || "",
        material: frameData.material || [],
        shape: frameData.shape || [],
        style: frameData.style || [],
        hsn_code: frameData.hsn_code || "",
        sizes: frameData.sizes || [],
        gender: frameData.gender || [],
      });

      // Set variants data
      if (frameData.variants && frameData.variants.length > 0) {
        const transformedVariants = frameData.variants.map((variant: any) => ({
          frame_color: variant.frame_color || [],
          temple_color: variant.temple_color || [],
          price: variant.price?.mrp || variant.price?.base_price || 0,
          images: variant.images || [],
        }));
        setVariants(transformedVariants);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch frame data", err);
      toast.error("Failed to load frame data");
      router.push("/dashboard/products/frames");
    }
  }

  useEffect(() => {
    fetchOptions();
    fetchFrameData();
  }, [frameId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Edit Frame</h2>

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

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Specifications</h3>
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
                    {[...genders, ...formData.gender].map((gender, i) => (
                      <MultiSelectItem key={`${gender}-${i}`} value={gender}>
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
                      [...(options?.material ?? []), ...formData?.material].map((material, i) => (
                        <MultiSelectItem key={`${material}-${i}`} value={material}>
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
                      [...(options?.shape ?? []), ...formData.shape].map((shape, i) => (
                        <MultiSelectItem key={`${shape}-${i}`} value={shape}>
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
                    {[...(options?.style ?? []), ...formData?.style].map((style, i) => (
                      <MultiSelectItem key={`${style}-${i}`} value={style}>
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
                    {[...sizes, ...formData.sizes].map((size, i) => (
                      <MultiSelectItem key={`${size}-${i}`} value={size} className="capitalize">
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
            </div>
          </CardContent>
        </Card>

        {/* Variants Management */}
        <FramesVariantManager
          variants={variants}
          onVariantsChange={setVariants}
          uploadFunction={ImageUploadFunction}
        />

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Frame"}
          </Button>
        </div>
      </form>
    </div>
  );
}