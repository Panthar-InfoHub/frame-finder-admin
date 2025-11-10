"use client";

import React, { useState, useTransition, useEffect } from "react";
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
import { updateLensSolutionAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { Loader2, Info } from "lucide-react";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "frames" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

interface Variant {
  _id?: string;
  sizes: string;
  lens_material: string[];
  images: string[];
  hsn_code: string;
  mfg_date: string;
  exp_date: string;
  origin_country: string;
  case_available: boolean;
  price: {
    base_price: number;
    mrp: number;
    shipping_price: {
      custom: boolean;
      value: number;
    };
    total_price: number;
  };
  stock: {
    current: number;
    minimum: number;
  };
}

interface EditLensSolutionFormProps {
  lensSolution: any;
}

export default function EditLensSolutionForm({ lensSolution }: EditLensSolutionFormProps) {
  const materialOptions = ["Saline", "Buffer", "Hydrogen Peroxide", "Multipurpose", "Enzymatic"];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [brandName, setBrandName] = useState(lensSolution.brand_name || "");
  const [productCode, setProductCode] = useState(lensSolution.productCode || "");
  const [rating, setRating] = useState(lensSolution.rating || 0);
  const [status, setStatus] = useState(lensSolution.status || "active");

  const [variants, setVariants] = useState<Variant[]>(
    lensSolution.variants?.map((v: any) => ({
      _id: v._id,
      sizes: v.sizes || "",
      lens_material: v.lens_material || [],
      images: v.images?.map((img: any) => img.url || img) || [],
      hsn_code: v.hsn_code || "",
      mfg_date: v.mfg_date ? new Date(v.mfg_date).toISOString().split("T")[0] : "",
      exp_date: v.exp_date ? new Date(v.exp_date).toISOString().split("T")[0] : "",
      origin_country: v.origin_country || "",
      case_available: v.case_available || false,
      price: {
        base_price: v.price?.base_price || 0,
        mrp: v.price?.mrp || 0,
        shipping_price: {
          custom: v.price?.shipping_price?.custom || false,
          value: v.price?.shipping_price?.value || 100,
        },
        total_price: v.price?.total_price || 0,
      },
      stock: {
        current: v.stock?.current || 0,
        minimum: v.stock?.minimum || 5,
      },
    })) || []
  );

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      (newVariants[index] as any)[parent][child] = value;
    } else {
      (newVariants[index] as any)[field] = value;
    }

    // Auto-calculate total price when price fields change
    if (field.startsWith("price")) {
      const variant = newVariants[index];
      const shipping = variant.price.shipping_price.custom
        ? variant.price.shipping_price.value
        : 100;
      newVariants[index].price.total_price = variant.price.mrp + shipping;
    }

    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (variants.some((v) => !v.sizes || !v.hsn_code)) {
      toast.error("Please fill all required fields for each variant");
      return;
    }

    const completeData = {
      brand_name: brandName,
      productCode: productCode,
      rating: Number(rating),
      status: status,
      variants: variants.map((variant) => ({
        _id: variant._id,
        sizes: variant.sizes,
        lens_material: variant.lens_material,
        images: variant.images.map((url) => ({ url })),
        hsn_code: variant.hsn_code,
        mfg_date: variant.mfg_date,
        exp_date: variant.exp_date,
        origin_country: variant.origin_country,
        case_available: variant.case_available,
        price: {
          base_price: variant.price.base_price,
          mrp: variant.price.mrp,
          shipping_price: {
            custom: variant.price.shipping_price.custom,
            value: variant.price.shipping_price.custom ? variant.price.shipping_price.value : 0,
          },
          total_price: variant.price.total_price,
        },
        // Note: stock is not updated here as per API spec
      })),
    };

    startTransition(async () => {
      const response = await updateLensSolutionAction(lensSolution._id, completeData);
      if (response.success) {
        toast.success(response.message);
        router.push(`/dashboard/products/lens-solution/${lensSolution._id}`);
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton href={`/dashboard/products/lens-solution/${lensSolution._id}`} className="mb-4">
        Back to Details
      </BackButton>

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
                  placeholder="LS-OP-100"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="OptiPure"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  placeholder="4.5"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  disabled={isPending}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants */}
        {variants.map((variant, index) => (
          <Card key={variant._id || index}>
            <CardHeader>
              <h3 className="text-lg font-semibold">Variant {index + 1}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Size (e.g., 100ml, 360ml)</Label>
                  <Input
                    placeholder="100ml"
                    value={variant.sizes}
                    onChange={(e) => updateVariant(index, "sizes", e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label>Lens Material</Label>
                  <MultiSelect
                    values={variant.lens_material}
                    onValuesChange={(values) => updateVariant(index, "lens_material", values)}
                  >
                    <MultiSelectTrigger disabled={isPending}>
                      <MultiSelectValue placeholder="Select materials" />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      {materialOptions.map((material) => (
                        <MultiSelectItem key={material} value={material}>
                          {material}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectContent>
                  </MultiSelect>
                </div>

                <div>
                  <Label>HSN Code</Label>
                  <Input
                    placeholder="3307"
                    value={variant.hsn_code}
                    onChange={(e) => updateVariant(index, "hsn_code", e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label>Country of Origin</Label>
                  <Input
                    placeholder="India"
                    value={variant.origin_country}
                    onChange={(e) => updateVariant(index, "origin_country", e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label>Manufacturing Date</Label>
                  <Input
                    type="date"
                    value={variant.mfg_date}
                    onChange={(e) => updateVariant(index, "mfg_date", e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={variant.exp_date}
                    onChange={(e) => updateVariant(index, "exp_date", e.target.value)}
                    disabled={isPending}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`case-${index}`}
                    checked={variant.case_available}
                    onCheckedChange={(checked) => updateVariant(index, "case_available", checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`case-${index}`} className="cursor-pointer">
                    Case Available
                  </Label>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Base Price (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="120"
                      value={variant.price.base_price || ""}
                      onChange={(e) =>
                        updateVariant(index, "price.base_price", parseFloat(e.target.value) || 0)
                      }
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label>MRP (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="150"
                      value={variant.price.mrp || ""}
                      onChange={(e) =>
                        updateVariant(index, "price.mrp", parseFloat(e.target.value) || 0)
                      }
                      required
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Shipping Price (₹)</Label>
                      <div className="flex items-center space-x-2">
                        <Label className="text-xs text-muted-foreground cursor-pointer">
                          Custom
                        </Label>
                        <Switch
                          checked={variant.price.shipping_price.custom}
                          onCheckedChange={(checked) =>
                            updateVariant(index, "price.shipping_price.custom", checked)
                          }
                          disabled={isPending}
                        />
                      </div>
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={
                        variant.price.shipping_price.custom
                          ? variant.price.shipping_price.value
                          : 100
                      }
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "price.shipping_price.value",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={!variant.price.shipping_price.custom || isPending}
                      className={
                        !variant.price.shipping_price.custom
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : ""
                      }
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <Label>Total Price (₹)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2 text-sm">
                              <div className="font-semibold border-b pb-1">💰 Price Breakdown</div>
                              <div className="space-y-1.5">
                                <div className="flex justify-between">
                                  <span className="text-foreground">Base Price:</span>
                                  <span className="font-medium">₹{variant.price.base_price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground">MRP:</span>
                                  <span className="font-medium">₹{variant.price.mrp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground">Shipping:</span>
                                  <span className="font-medium">
                                    ₹
                                    {variant.price.shipping_price.custom
                                      ? variant.price.shipping_price.value
                                      : 100}
                                  </span>
                                </div>
                                <div className="border-t pt-1.5">
                                  <div className="flex justify-between">
                                    <span className="font-semibold">Total:</span>
                                    <span className="font-bold text-primary">
                                      ₹{variant.price.total_price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      type="number"
                      value={variant.price.total_price || ""}
                      placeholder="Auto calculated"
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>


              {/* Images */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">Images</h4>
                <div className="flex items-center gap-4 mb-4">
                  <ImageUploader
                    images={variant.images}
                    onChange={(images) => updateVariant(index, "images", images)}
                    uploadFunction={ImageUploadFunction}
                    maxImages={10}
                    buttonLabel="Add Images"
                  />
                  <span className="text-sm text-muted-foreground">
                    {variant.images.length} image(s)
                  </span>
                </div>

                {variant.images.length > 0 && (
                  <ImageSection
                    images={variant.images}
                    getSignedUrl={getSignedViewUrl}
                    onChange={(images) => updateVariant(index, "images", images)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}

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
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Lens Solution
          </Button>
        </div>
      </form>
    </div>
  );
}
