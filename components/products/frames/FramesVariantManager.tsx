"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ImageIcon, Info } from "lucide-react";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Variant {
  frame_color: string;
  temple_color: string;
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
      frame_color: "",
      temple_color: "",
      price: {
        base_price: 0,
        mrp: 0,
        shipping_price: {
          custom: false,
          value: 100,
        },
        total_price: 100,
      },
      stock: {
        current: 0,
        minimum: 5,
      },
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
                <Label>Frame Color</Label>
                <Input
                  value={variant.frame_color}
                  onChange={(e) => updateVariant(index, "frame_color", e.target.value)}
                  placeholder="Enter frame color..."
                />
              </div>

              {/* Temple Colors */}
              <div>
                <Label>Temple Color</Label>
                <Input
                  value={variant.temple_color}
                  onChange={(e) => updateVariant(index, "temple_color", e.target.value)}
                  placeholder="Enter temple color..."
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-1 bg-primary rounded-full"></div>
                <Label className="text-base font-semibold text-foreground">Pricing Details</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`discounted-price-${index}`} className="text-xs">
                    Discounted Price (₹)
                  </Label>
                  <Input
                    id={`discounted-price-${index}`}
                    type="number"
                    value={variant.price.base_price || ""}
                    onChange={(e) => {
                      const basePrice = parseFloat(e.target.value) || 0;
                      const newPrice = { ...variant.price, base_price: basePrice };
                      // Auto calculate total price
                      newPrice.total_price =
                        newPrice.mrp +
                        (newPrice.shipping_price.custom ? newPrice.shipping_price.value : 100);
                      updateVariant(index, "price", newPrice);
                    }}
                    placeholder="Enter discounted price"
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`mrp-${index}`} className="text-xs">
                    MRP (₹)
                  </Label>
                  <Input
                    id={`mrp-${index}`}
                    type="number"
                    value={variant.price.mrp || ""}
                    onChange={(e) => {
                      const mrp = parseFloat(e.target.value) || 0;
                      const newPrice = { ...variant.price, mrp };
                      // Auto calculate total price
                      newPrice.total_price =
                        mrp +
                        (newPrice.shipping_price.custom ? newPrice.shipping_price.value : 100);
                      updateVariant(index, "price", newPrice);
                    }}
                    placeholder="Enter MRP"
                    min="0"
                    step="0.01"
                    className="mt-1"
                  />
                </div>

                {/* Shipping Price */}
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-muted">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={`custom-shipping-${index}`} className="text-sm font-medium">
                        Custom Shipping Price
                      </Label>
                      <div className="text-xs text-muted-foreground">
                        {variant.price.shipping_price.custom
                          ? "Using custom shipping rate"
                          : "Using default rate (₹100)"}
                      </div>
                    </div>
                    <Switch
                      id={`custom-shipping-${index}`}
                      checked={variant.price.shipping_price.custom}
                      onCheckedChange={(checked) => {
                        const newPrice = {
                          ...variant.price,
                          shipping_price: {
                            ...variant.price.shipping_price,
                            custom: checked as boolean,
                            value: checked ? variant.price.shipping_price.value : 100,
                          },
                        };
                        // Auto calculate total price
                        newPrice.total_price =
                          newPrice.mrp + (checked ? newPrice.shipping_price.value : 100);
                        updateVariant(index, "price", newPrice);
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`shipping-price-${index}`} className="text-xs">
                      Shipping Price (₹)
                    </Label>
                    <Input
                      id={`shipping-price-${index}`}
                      type="number"
                      value={
                        variant.price.shipping_price.custom
                          ? variant.price.shipping_price.value || ""
                          : 100
                      }
                      onChange={(e) => {
                        if (variant.price.shipping_price.custom) {
                          const shippingValue = parseFloat(e.target.value) || 0;
                          const newPrice = {
                            ...variant.price,
                            shipping_price: {
                              ...variant.price.shipping_price,
                              value: shippingValue,
                            },
                          };
                          // Auto calculate total price
                          newPrice.total_price = newPrice.mrp + shippingValue;
                          updateVariant(index, "price", newPrice);
                        }
                      }}
                      placeholder={
                        variant.price.shipping_price.custom
                          ? "Enter shipping price"
                          : "Default shipping"
                      }
                      min="0"
                      step="0.01"
                      disabled={!variant.price.shipping_price.custom}
                      className={`mt-1 ${
                        !variant.price.shipping_price.custom
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Total Price */}
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`total-price-${index}`} className="text-xs">
                      Total Price (₹)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-popover border border-border shadow-lg rounded-md p-3 max-w-xs"
                        >
                          <div className="space-y-2 text-sm">
                            <div className="font-semibold text-popover-foreground border-b border-border pb-1">
                              💰 Price Breakdown
                            </div>
                            <div className="space-y-1.5 text-popover-foreground">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Discounted Price:</span>
                                <span className="font-medium">
                                  ₹{variant.price.base_price || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">MRP:</span>
                                <span className="font-medium">₹{variant.price.mrp || 0}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Shipping:</span>
                                <span className="font-medium">
                                  ₹
                                  {variant.price.shipping_price.custom
                                    ? variant.price.shipping_price.value
                                    : 100}
                                  {!variant.price.shipping_price.custom && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                      (default)
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="border-t border-border pt-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-popover-foreground">
                                    Total Price:
                                  </span>
                                  <span className="font-bold text-primary text-base">
                                    ₹{variant.price.total_price || 0}
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
                    id={`total-price-${index}`}
                    type="number"
                    value={variant.price.total_price || ""}
                    placeholder="Auto calculated"
                    disabled
                    className="mt-1 bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Stock Management */}
            {/* <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-1 bg-orange-500 rounded-full"></div>
                <Label className="text-base font-semibold text-foreground">Stock Management</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`current-stock-${index}`} className="text-xs">
                    Current Stock
                  </Label>
                  <Input
                    id={`current-stock-${index}`}
                    type="number"
                    value={variant.stock.current || ""}
                    onChange={(e) => {
                      const stock = { ...variant.stock, current: parseInt(e.target.value) || 0 };
                      updateVariant(index, "stock", stock);
                    }}
                    placeholder="Enter current stock"
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`minimum-stock-${index}`} className="text-xs">
                    Minimum Stock
                  </Label>
                  <Input
                    id={`minimum-stock-${index}`}
                    type="number"
                    value={variant.stock.minimum || ""}
                    onChange={(e) => {
                      const stock = { ...variant.stock, minimum: parseInt(e.target.value) || 5 };
                      updateVariant(index, "stock", stock);
                    }}
                    placeholder="Enter minimum stock"
                    min="0"
                    className="mt-1"
                  />
                </div>
              </div>
            </div> */}

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
