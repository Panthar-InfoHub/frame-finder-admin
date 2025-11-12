"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createColorContactLensAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" }, // Using frames folder
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

export default function CreateColorContactLensForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [productCode, setProductCode] = useState("");
  const [brandName, setBrandName] = useState("");
  const [contactLensCover, setContactLensCover] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [lensType, setLensType] = useState<"zero_power" | "power">("zero_power");
  const [variants, setVariants] = useState<ColorContactLensVariantType[]>([
    {
      disposability: "monthly",
      mfg_date: new Date(),
      exp_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      hsn_code: "",
      pieces_per_box: 1,
      color: "",
      price: {
        base_price: 0,
        mrp: 0,
        shipping_price: { custom: false, value: 100 },
        total_price: 0,
      },
      stock: {
        current: 0,
        minimum: 5,
      },
      images: [],
      power_range: undefined,
    },
  ]);

  const availableSizes = ["14.0mm", "14.2mm", "14.5mm", "15.0mm"];

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
      variant: variants,
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

      const resp = await createColorContactLensAction(result.data);


      if (!resp.success) {
        toast.error(resp.message || "Failed to create color contact lens");
        return;
      }

      toast.success("Color contact lens created successfully");
      router.push("/dashboard/products/contact-lens-color");
    });
  };

  // When lens type changes, update variants' power_range accordingly
  const handleLensTypeChange = (newType: "zero_power" | "power") => {
    setLensType(newType);

    // Update existing variants to match new lens type
    const updatedVariants = variants.map((variant) => ({
      ...variant,
      power_range: newType === "power" ? { spherical: { min: -8, max: 0 } } : undefined,
    }));
    setVariants(updatedVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/products/contact-lens-color">
          Back to Color Contact Lenses
        </BackButton>
        <h2 className="text-xl font-semibold">Add New Color Contact Lens</h2>
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

        {/* Lens Type Selection */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Lens Power Type</h3>
            <p className="text-sm text-muted-foreground">
              Select whether this is a zero power (cosmetic only) or power lens (with prescription).
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="lensType">Power Type</Label>
              <Select value={lensType} onValueChange={(value: any) => handleLensTypeChange(value)}>
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
              isCreate
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
            {isPending ? "Creating..." : "Create Color Contact Lens"}
          </Button>
        </div>
      </form>
    </div>
  );
}
