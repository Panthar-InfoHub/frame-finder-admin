"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/custom/multi-select";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { ColorContactLensSchema, ColorContactLensVariantType } from "@/lib/validations";
import ColorContactLensVariantManager from "./ColorContactLensVariantManager";
import { getColorContactLensById, updateColorContactLensAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" }, // Using frames folder
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface EditColorContactLensFormProps {
  colorContactLensId: string;
}

export default function EditColorContactLensForm({
  colorContactLensId,
}: EditColorContactLensFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [productCode, setProductCode] = useState("");
  const [brandName, setBrandName] = useState("");
  const [contactLensCover, setContactLensCover] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [lensType, setLensType] = useState<"zero_power" | "power">("zero_power");
  const [variants, setVariants] = useState<ColorContactLensVariantType[]>([]);

  const availableSizes = ["14.0mm", "14.2mm", "14.5mm", "15.0mm"];

  useEffect(() => {
    async function fetchColorContactLens() {
      try {
        setIsLoading(true);
        const resp = await getColorContactLensById(colorContactLensId);

        if (!resp?.success || !resp?.data) {
          toast.error("Failed to load color contact lens data");
          return;
        }

        const data = resp.data;
        setProductCode(data.productCode || "");
        setBrandName(data.brand_name || "");
        setContactLensCover(data.contact_lens_cover || false);
        setSelectedSizes(data.size || []);
        setLensType(data.lens_type || "zero_power");
        setVariants(data.variants || []);
      } catch (error) {
        console.error("Error fetching color contact lens:", error);
        toast.error("Failed to load color contact lens data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchColorContactLens();
  }, [colorContactLensId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (variants.length === 0) {
      toast.error("At least one variant is required");
      return;
    }

    const completeData = {
      productCode,
      brand_name: brandName,
      contact_lens_cover: contactLensCover,
      size: selectedSizes,
      lens_type: lensType,
      variants: variants,
    };

    const result = ColorContactLensSchema.safeParse(completeData);
    if (!result.success) {
      console.error("Validation Errors:", result.error.issues);
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
      const resp = await updateColorContactLensAction(colorContactLensId, result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to update color contact lens");
        return;
      }
      toast.success("Color contact lens updated successfully");
      router.push(`/dashboard/products/contact-lens-color/${colorContactLensId}`);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-60" />
          <div></div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton href={`/dashboard/products/contact-lens-color/${colorContactLensId}`}>
          Back to Details
        </BackButton>
        <h2 className="text-xl font-semibold">Edit Color Contact Lens</h2>
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
                <Label htmlFor="productCode">Product Code *</Label>
                <Input
                  id="productCode"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Enter product code..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="brandName">Brand Name *</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sizes">Sizes</Label>
                <MultiSelect values={selectedSizes} onValuesChange={setSelectedSizes}>
                  <MultiSelectTrigger className="min-w-[300px]">
                    <MultiSelectValue placeholder="Select sizes" />
                  </MultiSelectTrigger>
                  <MultiSelectContent className="min-w-[300px]">
                    {availableSizes.map((size) => (
                      <MultiSelectItem key={size} value={size}>
                        {size}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="contactLensCover"
                checked={contactLensCover}
                onCheckedChange={(checked) => setContactLensCover(checked as boolean)}
              />
              <Label htmlFor="contactLensCover">Contact Lens Cover</Label>
            </div>
          </CardContent>
        </Card>

        {/* Lens Type Display (Read-only in edit mode) */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Lens Power Type</h3>
            <p className="text-sm text-muted-foreground">
              Power type cannot be changed after creation.
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="lensType">Power Type</Label>
              <Select value={lensType} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select power type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zero_power">Zero Power (Cosmetic)</SelectItem>
                  <SelectItem value="power">With Power</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <p className="text-sm text-muted-foreground">
              {lensType === "zero_power"
                ? "Zero power lenses - cosmetic use only"
                : "Power lenses with spherical power range (-20 to +20)"}
            </p>
          </CardHeader>
          <CardContent>
            <ColorContactLensVariantManager
              lensType={lensType}
              variants={variants}
              onVariantsChange={setVariants}
              uploadFunction={ImageUploadFunction}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Color Contact Lens"}
          </Button>
        </div>
      </form>
    </div>
  );
}
