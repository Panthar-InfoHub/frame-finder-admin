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
import { updateReaderAction, getReaderById } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeObject } from "@/utils/helpers";
import AddValueDialog from "@/components/products/addValueDialog";
import { getFrameFormData } from "@/actions/vendors/form-data";
import { useRouter } from "next/navigation";
import { ReaderSchema, ReaderVariantType } from "@/lib/validations";
import ReadersVariantManager from "@/components/products/readers/ReadersVariantManager";
import { BackButton } from "@/components/ui/back-button";
import { Loader2 } from "lucide-react";
import { getSignedViewUrl } from "@/actions/cloud-storage";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface EditReaderFormProps {
  readerId: string;
}

export default function EditReaderForm({ readerId }: EditReaderFormProps) {
  const genders = ["male", "female", "kids", "unisex"];
  const sizes = ["S", "M", "L", "XL"];

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variants, setVariants] = useState<ReaderVariantType[]>([]);

  // Form state for pre-filled data
  const [formData, setFormData] = useState({
    productCode: "",
    brand_name: "",
    material: [] as string[],
    shape: [] as string[],
    style: [] as string[],
    hsn_code: "",
    sizes: [] as string[],
    gender: [] as string[],
    dimension: {
      lens_width: "",
      bridge_width: "",
      temple_length: "",
      lens_height: "",
    },
  });

  useEffect(() => {
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

    async function fetchReaderData() {
      try {
        const resp = await getReaderById(readerId);
        if (resp.success && resp.data) {
          const data = resp.data;
          setFormData({
            productCode: data.productCode || "",
            brand_name: data.brand_name || "",
            material: data.material || [],
            shape: data.shape || [],
            style: data.style || [],
            hsn_code: data.hsn_code || "",
            sizes: data.sizes || [],
            gender: data.gender || [],
            dimension: {
              lens_width: data.dimension?.lens_width || "",
              bridge_width: data.dimension?.bridge_width || "",
              temple_length: data.dimension?.temple_length || "",
              lens_height: data.dimension?.lens_height || "",
            },
          });

          if (data.variants && data.variants.length > 0) {
            const temp_variants = await Promise.all(
              (data.variants || []).map(async (variant) => {
                if (variant.images && variant.images.length > 0) {
                  const signedImages = await Promise.all(
                    variant.images.map(async (img: any) => ({
                      ...img,
                      signedUrl: await getSignedViewUrl(img.url),
                    }))
                  );
                  return { ...variant, images: signedImages };
                }
                return variant;
              })
            );
            setVariants(temp_variants);
          }
        } else {
          toast.error("Failed to load reader data");
        }
      } catch (err) {
        console.error("Failed to fetch reader data", err);
        toast.error("Failed to load reader data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOptions();
    fetchReaderData();
  }, [readerId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    const formdata = new FormData(e.currentTarget);
    const basicData = normalizeObject(formdata, ["hsn_code", "productCode"]);

    const dimension = {
      lens_width: basicData.lens_width as string,
      bridge_width: basicData.bridge_width as string,
      temple_length: basicData.temple_length as string,
      lens_height: basicData.lens_height as string,
    };

    delete basicData.lens_width;
    delete basicData.bridge_width;
    delete basicData.temple_length;
    delete basicData.lens_height;

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
      const resp = await updateReaderAction(readerId, result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to update reader glass");
        return;
      }
      toast.success("Reader glass updated successfully");
      router.push(`/dashboard/products/readers/${readerId}`);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton href={`/dashboard/products/readers/${readerId}`}>
          Back to Reader Details
        </BackButton>
        <h2 className="text-xl font-semibold">Edit Reader Glass</h2>
        <div></div>
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
                  defaultValue={formData.productCode}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  defaultValue={formData.brand_name}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="hsn_code">HSN/SAC Code</Label>
                <Input
                  id="hsn_code"
                  name="hsn_code"
                  defaultValue={formData.hsn_code}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="material">Material</Label>
                <MultiSelect name="material" defaultValues={formData.material}>
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
                      <AddValueDialog
                        type="material"
                        onValueAdded={async () => {
                          const resp = await getFrameFormData();
                          const formatted: Record<string, string[]> = {};
                          resp.data.forEach((item: { type: string; values: string[] }) => {
                            formatted[item.type] = item.values;
                          });
                          setOptions(formatted);
                        }}
                      />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="shape">Shape</Label>
                <MultiSelect name="shape" defaultValues={formData.shape}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select shapes" />
                  </MultiSelectTrigger>
                  <MultiSelectContent search={false}>
                    {options?.shape?.length > 0 &&
                      options?.shape?.map((shape) => (
                        <MultiSelectItem key={shape} value={shape}>
                          {shape}
                        </MultiSelectItem>
                      ))}
                    <div className="p-2 border-t">
                      <AddValueDialog
                        type="shape"
                        onValueAdded={async () => {
                          const resp = await getFrameFormData();
                          const formatted: Record<string, string[]> = {};
                          resp.data.forEach((item: { type: string; values: string[] }) => {
                            formatted[item.type] = item.values;
                          });
                          setOptions(formatted);
                        }}
                      />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <MultiSelect name="style" defaultValues={formData.style}>
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
                      <AddValueDialog
                        type="style"
                        onValueAdded={async () => {
                          const resp = await getFrameFormData();
                          const formatted: Record<string, string[]> = {};
                          resp.data.forEach((item: { type: string; values: string[] }) => {
                            formatted[item.type] = item.values;
                          });
                          setOptions(formatted);
                        }}
                      />
                    </div>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="sizes">Sizes</Label>
                <MultiSelect name="sizes" defaultValues={formData.sizes}>
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
                <MultiSelect name="gender" defaultValues={formData.gender}>
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
                  name="lens_width"
                  defaultValue={formData.dimension.lens_width}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="bridge_width">Bridge Width (mm)</Label>
                <Input
                  id="bridge_width"
                  name="bridge_width"
                  defaultValue={formData.dimension.bridge_width}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="temple_length">Temple Length (mm)</Label>
                <Input
                  id="temple_length"
                  name="temple_length"
                  defaultValue={formData.dimension.temple_length}
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="lens_height">Lens Height (mm)</Label>
                <Input
                  id="lens_height"
                  name="lens_height"
                  defaultValue={formData.dimension.lens_height}
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
            onClick={() => router.push(`/dashboard/products/readers/${readerId}`)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Reader"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
