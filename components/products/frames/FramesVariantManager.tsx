"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import { InputTags } from "@/components/ui/custom/InputTags";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";

interface Variant {
  frame_color: string[];
  temple_color: string[];
  price: number;
  images: { url: string }[];
}

interface VariantManagerProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  uploadFunction: (files: File[]) => Promise<string[]>;
}

export default function FramesVariantManager({
  variants,
  onVariantsChange,
  uploadFunction,
}: VariantManagerProps) {
  const addVariant = () => {
    const newVariant: Variant = {
      frame_color: [],
      temple_color: [],
      price: 0,
      images: [],
    };
    onVariantsChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      onVariantsChange(newVariants);
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onVariantsChange(newVariants);
  };

  const handleImageChange = (variantIndex: number, imageUrls: string[]) => {
    const imageObjects = imageUrls.map((url) => ({ url }));
    updateVariant(variantIndex, "images", imageObjects);
  };

  const handleImageSectionChange = (variantIndex: number, newImageUrls: string[]) => {
    const imageObjects = newImageUrls.map((url) => ({ url }));
    updateVariant(variantIndex, "images", imageObjects);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Variants</h3>
        <Button type="button" onClick={addVariant} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.map((variant, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Variant {index + 1}</CardTitle>
              {variants.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeVariant(index)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Frame Colors */}
              <div>
                <Label>Frame Colors</Label>
                <InputTags
                  tags={variant.frame_color}
                  onChange={(tags) => updateVariant(index, "frame_color", tags)}
                  placeholder="Add frame colors..."
                  emptyMessage="No frame colors added"
                />
              </div>

              {/* Temple Colors */}
              <div>
                <Label>Temple Colors</Label>
                <InputTags
                  tags={variant.temple_color}
                  onChange={(tags) => updateVariant(index, "temple_color", tags)}
                  placeholder="Add temple colors..."
                  emptyMessage="No temple colors added"
                />
              </div>
            </div>

            {/* Price */}
            <div className="max-w-xs">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={variant.price || ""}
                onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="mt-1"
              />
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Images ({variant.images.length})</Label>
                <ImageUploader
                  images={variant.images.map((img) => img.url)}
                  onChange={(urls) => handleImageChange(index, urls)}
                  uploadFunction={uploadFunction}
                  maxImages={10}
                  buttonLabel="Add Images"
                />
              </div>

              {/* Image Gallery */}
              {variant.images.length > 0 && (
                <div className="mb-3">
                  <ImageSection
                    images={variant.images.map((img) => img.url)}
                    getSignedUrl={getSignedViewUrl}
                    onChange={(newUrls) => handleImageSectionChange(index, newUrls)}
                  />
                </div>
              )}

              {/* No Images UI */}
              {variant.images.length === 0 && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-3">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images uploaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}