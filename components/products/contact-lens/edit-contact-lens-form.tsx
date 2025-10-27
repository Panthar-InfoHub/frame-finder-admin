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
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/custom/multi-select";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { ContactLensSchema, ContactLensVariantType } from "@/lib/validations";
import ContactLensVariantManager from "./ContactLensVariantManager";
import { getContactLensById, updateContactLensAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" }, // Using frames folder for now
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface EditContactLensFormProps {
  contactLensId: string;
}

export default function EditContactLensForm({ contactLensId }: EditContactLensFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [productCode, setProductCode] = useState("");
  const [brandName, setBrandName] = useState("");
  const [contactLensCover, setContactLensCover] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [lensType, setLensType] = useState<"non_toric" | "toric" | "multi_focal">("non_toric");
  const [variants, setVariants] = useState<ContactLensVariantType[]>([]);

  const availableSizes = ["14.0mm", "14.2mm", "14.5mm", "15.0mm"];

  useEffect(() => {
    async function fetchContactLens() {
      try {
        setIsLoading(true);
        const resp = await getContactLensById(contactLensId);

        if (!resp?.success || !resp?.data) {
          toast.error("Failed to load contact lens data");
          return;
        }

        const data = resp.data;
        setProductCode(data.productCode || "");
        setBrandName(data.brand_name || "");
        setContactLensCover(data.contact_lens_cover || false);
        setSelectedSizes(data.size || []);
        setLensType(data.lens_type || "non_toric");
        setVariants(data.variants || []);
      } catch (error) {
        console.error("Error fetching contact lens:", error);
        toast.error("Failed to load contact lens data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContactLens();
  }, [contactLensId]);

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

    const result = ContactLensSchema.safeParse(completeData);
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
      const resp = await updateContactLensAction(contactLensId, result.data);
      if (!resp.success) {
        toast.error(resp.message || "Failed to update contact lens");
        return;
      }
      toast.success("Contact lens updated successfully");
      router.push(`/dashboard/products/contact-lens/${contactLensId}`);
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
        <BackButton href={`/dashboard/products/contact-lens/${contactLensId}`}>
          Back to Details
        </BackButton>
        <h2 className="text-xl font-semibold">Edit Contact Lens</h2>
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
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Enter product code..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="brandName">Brand Name</Label>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contactLensCover"
                  checked={contactLensCover}
                  onCheckedChange={(checked) => setContactLensCover(checked as boolean)}
                />
                <Label htmlFor="contactLensCover">Contact Lens Cover</Label>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Variants */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Variants</h3>
            <p className="text-sm text-muted-foreground">
              {lensType === "non_toric" && "Spherical power only (-20 to +20)"}
              {lensType === "toric" && "Spherical + Cylindrical power (-10 to 0)"}
              {lensType === "multi_focal" && "Spherical + Addition power (+1 to +5)"}
            </p>
          </CardHeader>
          <CardContent>
            <ContactLensVariantManager
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
            {isPending ? "Updating..." : "Update Contact Lens"}
          </Button>
        </div>
      </form>
    </div>
  );
}
