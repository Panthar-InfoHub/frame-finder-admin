"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Info } from "lucide-react";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
} from "@/components/ui/custom/multi-select";

// Power options for readers (arranged in ascending order from negative to positive)
const POWER_OPTIONS = [
  // Negative powers (from -10.00 to -0.25)
  { value: "-10.00", label: "-10.00" },
  { value: "-9.00", label: "-9.00" },
  { value: "-8.00", label: "-8.00" },
  { value: "-7.00", label: "-7.00" },
  { value: "-6.00", label: "-6.00" },
  { value: "-5.50", label: "-5.50" },
  { value: "-5.00", label: "-5.00" },
  { value: "-4.50", label: "-4.50" },
  { value: "-4.00", label: "-4.00" },
  { value: "-3.75", label: "-3.75" },
  { value: "-3.50", label: "-3.50" },
  { value: "-3.25", label: "-3.25" },
  { value: "-3.00", label: "-3.00" },
  { value: "-2.50", label: "-2.50" },
  { value: "-2.25", label: "-2.25" },
  { value: "-2.00", label: "-2.00" },
  { value: "-1.75", label: "-1.75" },
  { value: "-1.50", label: "-1.50" },
  { value: "-1.25", label: "-1.25" },
  { value: "-1.00", label: "-1.00" },
  { value: "-0.75", label: "-0.75" },
  { value: "-0.50", label: "-0.50" },
  { value: "-0.25", label: "-0.25" },
  // Positive powers (from +0.25 to +10.00)
  { value: "0.25", label: "+0.25" },
  { value: "0.50", label: "+0.50" },
  { value: "0.75", label: "+0.75" },
  { value: "1.00", label: "+1.00" },
  { value: "1.25", label: "+1.25" },
  { value: "1.50", label: "+1.50" },
  { value: "1.75", label: "+1.75" },
  { value: "2.00", label: "+2.00" },
  { value: "2.25", label: "+2.25" },
  { value: "2.50", label: "+2.50" },
  { value: "3.00", label: "+3.00" },
  { value: "3.25", label: "+3.25" },
  { value: "3.50", label: "+3.50" },
  { value: "3.75", label: "+3.75" },
  { value: "4.00", label: "+4.00" },
  { value: "4.50", label: "+4.50" },
  { value: "5.00", label: "+5.00" },
  { value: "5.50", label: "+5.50" },
  { value: "6.00", label: "+6.00" },
  { value: "7.00", label: "+7.00" },
  { value: "8.00", label: "+8.00" },
  { value: "9.00", label: "+9.00" },
  { value: "10.00", label: "+10.00" },
];

interface Variant {
  frame_color: string;
  temple_color: string;
  lens_color: string;
  power: number[];
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
  images: any;
}

interface VariantManagerProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  uploadFunction: (files: File[]) => Promise<string[]>;
}

export default function ReadersVariantManager({
  variants,
  onVariantsChange,
  uploadFunction,
}: VariantManagerProps) {

  const addVariant = () => {
    const newVariant: Variant = {
      frame_color: "",
      temple_color: "",
      lens_color: "",
      power: [],
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Product Variants</CardTitle>
          <Button type="button" onClick={addVariant} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant, index) => (
          <Card key={index} className="relative border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Variant {index + 1}</CardTitle>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeVariant(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 [&_label]:mb-1">
              {/* Colors Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Colors
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`frame-color-${index}`} className="text-xs">
                      Frame Color
                    </Label>
                    <Input
                      id={`frame-color-${index}`}
                      type="text"
                      value={variant.frame_color}
                      onChange={(e) => updateVariant(index, "frame_color", e.target.value)}
                      placeholder="e.g., Black, Brown"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`temple-color-${index}`} className="text-xs">
                      Temple Color
                    </Label>
                    <Input
                      id={`temple-color-${index}`}
                      type="text"
                      value={variant.temple_color}
                      onChange={(e) => updateVariant(index, "temple_color", e.target.value)}
                      placeholder="e.g., Black, Brown"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`lens-color-${index}`} className="text-xs">
                      Lens Color
                    </Label>
                    <Input
                      id={`lens-color-${index}`}
                      type="text"
                      value={variant.lens_color}
                      onChange={(e) => updateVariant(index, "lens_color", e.target.value)}
                      placeholder="e.g., Clear, Amber"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Power Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Reading Power
                </h4>
                <div>
                  <Label htmlFor={`power-select-${index}`} className="text-xs">
                    Select Power Values
                  </Label>
                  <MultiSelect
                    values={variant.power.map((p) => p.toString())}
                    onValuesChange={(values) => {
                      const powerNumbers = values.map((v) => parseFloat(v)).sort((a, b) => a - b);
                      updateVariant(index, "power", powerNumbers);
                    }}
                  >
                    <MultiSelectTrigger className="mt-1 min-w-[300px]">
                      <MultiSelectValue placeholder="Select power values" />
                    </MultiSelectTrigger>
                    <MultiSelectContent className="min-w-[300px]">
                      {POWER_OPTIONS.map((option) => (
                        <MultiSelectItem key={option.value} value={option.value}>
                          {option.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectContent>
                  </MultiSelect>
                  {variant.power.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {variant.power.map((powerValue) => (
                        <Badge key={powerValue} variant="secondary" className="px-3 py-1">
                          {powerValue > 0 ? `+${powerValue}` : powerValue}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`base-price-${index}`} className="text-xs">
                      Base Price (₹)
                    </Label>
                    <Input
                      id={`base-price-${index}`}
                      type="number"
                      value={variant.price.base_price || ""}
                      onChange={(e) => {
                        const basePrice = parseFloat(e.target.value) || 0;
                        updateVariant(index, "price", {
                          ...variant.price,
                          base_price: basePrice,
                        });
                      }}
                      placeholder="Enter base price"
                      required
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
                        const shippingValue = variant.price.shipping_price.custom
                          ? variant.price.shipping_price.value
                          : 100;
                        const newPrice = {
                          ...variant.price,
                          mrp,
                        };
                        // Auto calculate total price
                        newPrice.total_price = mrp + shippingValue;
                        updateVariant(index, "price", newPrice);
                      }}
                      placeholder="Enter MRP"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor={`shipping-price-${index}`} className="text-xs">
                        Shipping Price (₹)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor={`custom-shipping-${index}`}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          Custom
                        </Label>
                        <Switch
                          id={`custom-shipping-${index}`}
                          checked={variant.price.shipping_price.custom}
                          onCheckedChange={(checked) => {
                            const newPrice = {
                              ...variant.price,
                              shipping_price: {
                                ...variant.price.shipping_price,
                                custom: checked,
                              },
                            };
                            // Auto calculate total price
                            const shippingValue = checked
                              ? variant.price.shipping_price.value
                              : 100;
                            newPrice.total_price = variant.price.mrp + shippingValue;
                            updateVariant(index, "price", newPrice);
                          }}
                        />
                      </div>
                    </div>
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
                      className={`mt-1 ${!variant.price.shipping_price.custom
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : ""
                        }`}
                    />
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
                                  <span className="text-muted-foreground">Base Price:</span>
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
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Stock Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`current-stock-${index}`} className="text-xs">
                      Current Stock
                    </Label>
                    <Input
                      id={`current-stock-${index}`}
                      type="number"
                      value={variant.stock.current || ""}
                      onChange={(e) =>
                        updateVariant(index, "stock", {
                          ...variant.stock,
                          current: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter current stock"
                      required
                      min="0"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`min-stock-${index}`} className="text-xs">
                      Minimum Stock Threshold
                    </Label>
                    <Input
                      id={`min-stock-${index}`}
                      type="number"
                      value={variant.stock.minimum || ""}
                      onChange={(e) =>
                        updateVariant(index, "stock", {
                          ...variant.stock,
                          minimum: parseInt(e.target.value) || 5,
                        })
                      }
                      placeholder="Enter minimum stock"
                      min="0"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div> */}

              {/* Images Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Product Images
                </h4>
                <div className="space-y-4">
                  <ImageUploader
                    images={variant.images.map((img) => img.url)}
                    onChange={(urls) => handleImageChange(index, urls)}
                    uploadFunction={uploadFunction}
                  />
                  {variant.images.length > 0 && (
                    <ImageSection
                      images={variant.images.map((img) => img.signedUrl)}
                      onChange={(urls) => {
                        const imageObjects = urls.map((url) => ({ url }));
                        updateVariant(index, "images", imageObjects);
                      }}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
