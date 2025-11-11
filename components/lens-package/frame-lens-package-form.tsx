"use client";

import React, { useState, useTransition } from "react";
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

import { Card, CardContent, CardHeader } from "../ui/card";
import { ImageUploader } from "../ui/custom/ImageUploader";
import { ImageSection } from "../ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { FrameLensPackageSchema } from "@/lib/validations";
import { createFrameLensPackage } from "@/actions/vendors/lens-package";
import { useRouter } from "next/navigation";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "lens-packages" },
  });

  if (failed.length > 0) {
    toast.error(`${failed.length}/${files.length} file(s) failed to upload.`);
  } else {
    toast.success(`${success.length}/${files.length} file(s) uploaded successfully.`);
  }

  return success.map((item) => item.path);
};

const FrameLensPackageForm = () => {
  const prescriptionTypes = [
    { value: "single_vision", label: "Single Vision" },
    { value: "bi_focal", label: "Bi-Focal" },
    { value: "multi_focal", label: "Multi-Focal" },
  ];

  const lensIndexes = ["1.50", "1.56", "1.61", "1.67", "1.74"];

  const lensTypes = ["standard", "blue_cut", "photochromic", "polarized", "anti_reflective"];

  const powerRanges: Record<string, { spherical: string; cylindrical: string }> = {
    single_vision: { spherical: "-12.00 to +8.00", cylindrical: "-5.00 to +5.00" },
    bi_focal: { spherical: "-8.00 to +6.00", cylindrical: "-4.00 to +4.00" },
    multi_focal: { spherical: "-8.00 to +6.00", cylindrical: "-4.00 to +4.00" },
  };

  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>([]);
  const [selectedPrescriptionType, setSelectedPrescriptionType] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Manually construct the data object with proper types
    const data = {
      productCode: formData.get("productCode") as string,
      display_name: formData.get("display_name") as string,
      brand_name: formData.get("brand_name") as string,
      index: formData.get("index") as string,
      price: {
        mrp: Number(formData.get("mrp")),
        base_price: Number(formData.get("base_price")),
        total_price: Number(formData.get("total_price")),
      },
      duration: Number(formData.get("duration")),
      prescription_type: formData.get("prescription_type") as string,
      lens_type: formData.get("lens_type") as string,
      images: images.map((url) => ({ url })),
    };

    const result = FrameLensPackageSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message || "Invalid form data");
      return;
    }
    startTransition(async () => {
      const resp = await createFrameLensPackage(result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to create lens package");
        return;
      }
      toast.success("Lens package created successfully");
      router.push("/dashboard/lens-packages/frames");
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Create Frame Lens Package</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lens Type Selection - At the top */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Lens Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Select lens type and prescription specifications
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prescription_type">Prescription Type *</Label>
                <Select
                  name="prescription_type"
                  required
                  onValueChange={setSelectedPrescriptionType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {prescriptionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lens_type">Lens Type *</Label>
                <Select name="lens_type" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Lens Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {lensTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Power Range Display */}
            {selectedPrescriptionType && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-dashed">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="text-muted-foreground">Supported Power Range</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Spherical
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {powerRanges[selectedPrescriptionType]?.spherical}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Cylindrical
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {powerRanges[selectedPrescriptionType]?.cylindrical}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Lens Package Images</h3>
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

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Information</h3>
            <p className="text-sm text-muted-foreground">Enter package details and pricing</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productCode">Product Code *</Label>
                <Input id="productCode" required name="productCode" placeholder="e.g., LP001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  placeholder="e.g., Premium Thin Lens"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input id="brand_name" name="brand_name" placeholder="e.g., Zeiss, Crizal" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="index">Index *</Label>
                <Select name="index" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Index" />
                  </SelectTrigger>
                  <SelectContent>
                    {lensIndexes.map((index) => (
                      <SelectItem key={index} value={index}>
                        {index}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input id="duration" type="number" name="duration" required placeholder="e.g., 2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Pricing Details</h3>
            <p className="text-sm text-muted-foreground">Set the pricing for this lens package</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mrp">MRP (₹) *</Label>
                <Input id="mrp" type="number" name="mrp" required placeholder="e.g., 2500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_price">Discounted Price (₹) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  name="base_price"
                  required
                  placeholder="e.g., 2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_price">Total Price (₹) *</Label>
                <Input
                  id="total_price"
                  type="number"
                  name="total_price"
                  required
                  placeholder="e.g., 2000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FrameLensPackageForm;
