"use client";

import React, { useState, useTransition } from "react";
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
import { createLensSolutionAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { normalizeObject } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { Loader2, Info, Plus, Trash2 } from "lucide-react";
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

export default function CreateLensSolutionForm() {
  const materialOptions = ["Saline", "Buffer", "Hydrogen Peroxide", "Multipurpose", "Enzymatic"];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [variants, setVariants] = useState<Variant[]>([
    {
      sizes: "",
      lens_material: [],
      images: [],
      hsn_code: "",
      mfg_date: "",
      exp_date: "",
      origin_country: "",
      case_available: false,
      price: {
        base_price: 0,
        mrp: 0,
        shipping_price: {
          custom: false,
          value: 100,
        },
        total_price: 0,
      },
      stock: {
        current: 0,
        minimum: 5,
      },
    },
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sizes: "",
        lens_material: [],
        images: [],
        hsn_code: "",
        mfg_date: new Date().toISOString().split("T")[0],
        exp_date: "",
        origin_country: "",
        case_available: false,
        price: {
          base_price: 0,
          mrp: 0,
          shipping_price: {
            custom: false,
            value: 100,
          },
          total_price: 0,
        },
        stock: {
          current: 0,
          minimum: 5,
        },
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

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

    const formdata = new FormData(e.currentTarget);
    const basicData = normalizeObject(formdata, ["productCode"]);

    const completeData = {
      brand_name: basicData.brand_name,
      productCode: basicData.productCode,
      rating: Number(basicData.rating || 0),
      status: basicData.status || "active",
      variants: variants.map((variant) => ({
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
        stock: {
          current: variant.stock.current,
          minimum: variant.stock.minimum,
        },
      })),
    };

    startTransition(async () => {
      const response = await createLensSolutionAction(completeData);
      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard/products/lens-solution");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton href="/dashboard/products/lens-solution" className="mb-4">
        Back to Lens Solutions
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
                  name="productCode"
                  placeholder="LS-OP-100"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  placeholder="OptiPure"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  defaultValue="0"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
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
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Variant {index + 1}</h3>
              {variants.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
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
                    <Label>Discounted Price (₹)</Label>
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
                                  <span className="text-muted-foreground">Discounted Price:</span>
                                  <span className="font-medium">₹{variant.price.base_price}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">MRP:</span>
                                  <span className="font-medium">₹{variant.price.mrp}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Shipping:</span>
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

              {/* Stock */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-3">Stock</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="50"
                      value={variant.stock.current || ""}
                      onChange={(e) =>
                        updateVariant(index, "stock.current", parseInt(e.target.value) || 0)
                      }
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label>Minimum Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={variant.stock.minimum || ""}
                      onChange={(e) =>
                        updateVariant(index, "stock.minimum", parseInt(e.target.value) || 0)
                      }
                      disabled={isPending}
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

        {/* Add Variant Button */}
        <Button type="button" variant="outline" onClick={addVariant} disabled={isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Add Another Variant
        </Button>

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
            Create Lens Solution
          </Button>
        </div>
      </form>
    </div>
  );
}
