"use client";

import { useState } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/ui/custom/ImageUploader";
import { ImageSection } from "@/components/ui/custom/ImageSection";
import type { ContactLensVariantType } from "@/lib/validations";

interface ContactLensVariantManagerProps {
  lensType: "non_toric" | "toric" | "multi_focal";
  variants: ContactLensVariantType[];
  onVariantsChange: (variants: ContactLensVariantType[]) => void;
  uploadFunction: (files: File[]) => Promise<string[]>;
}

export default function ContactLensVariantManager({
  lensType,
  variants,
  onVariantsChange,
  uploadFunction,
}: ContactLensVariantManagerProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  // Power options for selects
  const sphericalPowers = Array.from({ length: 81 }, (_, i) => {
    const value = -20 + i * 0.5;
    return { label: value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2), value };
  });

  const cylindricalPowers = Array.from({ length: 41 }, (_, i) => {
    const value = -10 + i * 0.25;
    return { label: value.toFixed(2), value };
  });

  const additionPowers = Array.from({ length: 17 }, (_, i) => {
    const value = 1 + i * 0.25;
    return { label: `+${value.toFixed(2)}`, value };
  });

  const toggleVariant = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const addVariant = () => {
    const newVariant: ContactLensVariantType = {
      disposability: "monthly",
      mfg_date: new Date(),
      exp_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      hsn_code: "",
      pieces_per_box: 1,
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
      power_range: {
        spherical: { min: -10, max: 10 },
        cylindrical: lensType === "toric" ? { min: -10, max: 0 } : undefined,
        addition: lensType === "multi_focal" ? { min: 1, max: 5 } : undefined,
      },
    };
    onVariantsChange([...variants, newVariant]);
    setOpenIndexes([...openIndexes, variants.length]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      onVariantsChange(newVariants);
      setOpenIndexes(openIndexes.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    }
  };

  const updateVariant = (index: number, updates: Partial<ContactLensVariantType>) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    onVariantsChange(newVariants);
  };

  const updateNestedField = (index: number, path: string[], value: any) => {
    const newVariants = [...variants];
    let current: any = newVariants[index];
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onVariantsChange(newVariants);
  };

  // Auto-calculate total price
  const calculateTotalPrice = (index: number) => {
    const variant = variants[index];
    if (!variant) return;

    const basePrice = Number(variant.price?.base_price) || 0;
    const shippingPrice = variant.price?.shipping_price?.custom
      ? Number(variant.price.shipping_price.value) || 0
      : 0;
    const totalPrice = basePrice + shippingPrice;

    updateNestedField(index, ["price", "total_price"], totalPrice);
  };

  const handleImageChange = (variantIndex: number, imageUrls: string[]) => {
    const imageObjects = imageUrls.map((url) => ({ url }));
    updateVariant(variantIndex, { images: imageObjects });
  };

  const handleImageSectionChange = (variantIndex: number, newImageUrls: string[]) => {
    const imageObjects = newImageUrls.map((url) => ({ url }));
    updateVariant(variantIndex, { images: imageObjects });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Product Variants</Label>
        <Button type="button" onClick={addVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No variants added yet. Click "Add Variant" to create one.
        </Card>
      )}

      {variants.map((variant: ContactLensVariantType, index: number) => {
        const isOpen = openIndexes.includes(index);

        return (
          <Collapsible key={index} open={isOpen} onOpenChange={() => toggleVariant(index)}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger className="flex items-center gap-2 hover:underline">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <CardTitle className="text-base">Variant {index + 1}</CardTitle>
                  </CollapsibleTrigger>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {/* Disposability & HSN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`disposability-${index}`}>Disposability</Label>
                      <Select
                        value={variant.disposability}
                        onValueChange={(value: any) =>
                          updateVariant(index, { disposability: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select disposability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`hsn-code-${index}`}>HSN Code</Label>
                      <Input
                        id={`hsn-code-${index}`}
                        value={variant.hsn_code}
                        onChange={(e) => updateVariant(index, { hsn_code: e.target.value })}
                        placeholder="Enter HSN code"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`mfg-date-${index}`}>Manufacturing Date</Label>
                      <Input
                        id={`mfg-date-${index}`}
                        type="date"
                        value={
                          variant.mfg_date instanceof Date
                            ? variant.mfg_date.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updateVariant(index, { mfg_date: new Date(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`exp-date-${index}`}>Expiry Date</Label>
                      <Input
                        id={`exp-date-${index}`}
                        type="date"
                        value={
                          variant.exp_date instanceof Date
                            ? variant.exp_date.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updateVariant(index, { exp_date: new Date(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {/* Pieces per Box */}
                  <div>
                    <Label htmlFor={`pieces-${index}`}>Pieces per Box</Label>
                    <Input
                      id={`pieces-${index}`}
                      type="number"
                      value={variant.pieces_per_box}
                      onChange={(e) =>
                        updateVariant(index, { pieces_per_box: Number(e.target.value) })
                      }
                      placeholder="Enter pieces per box"
                    />
                  </div>

                  <Separator />

                  {/* Pricing Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Pricing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`base-price-${index}`}>Base Price</Label>
                        <Input
                          id={`base-price-${index}`}
                          type="number"
                          step="0.01"
                          value={variant.price.base_price}
                          onChange={(e) => {
                            updateNestedField(
                              index,
                              ["price", "base_price"],
                              Number(e.target.value)
                            );
                            setTimeout(() => calculateTotalPrice(index), 0);
                          }}
                          placeholder="Enter base price"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`mrp-${index}`}>MRP</Label>
                        <Input
                          id={`mrp-${index}`}
                          type="number"
                          step="0.01"
                          value={variant.price.mrp}
                          onChange={(e) =>
                            updateNestedField(index, ["price", "mrp"], Number(e.target.value))
                          }
                          placeholder="Enter MRP"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`shipping-price-${index}`}>Shipping Price</Label>
                      <Input
                        id={`shipping-price-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.price.shipping_price.value}
                        onChange={(e) => {
                          updateNestedField(
                            index,
                            ["price", "shipping_price", "value"],
                            Number(e.target.value)
                          );
                          setTimeout(() => calculateTotalPrice(index), 0);
                        }}
                        disabled={!variant.price.shipping_price.custom}
                        placeholder="Default: 100"
                        className={!variant.price.shipping_price.custom ? "bg-muted" : ""}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-shipping-${index}`}
                        checked={variant.price.shipping_price.custom}
                        onCheckedChange={(checked) => {
                          updateNestedField(index, ["price", "shipping_price", "custom"], checked);
                          if (!checked) {
                            updateNestedField(index, ["price", "shipping_price", "value"], 100);
                          }
                          setTimeout(() => calculateTotalPrice(index), 0);
                        }}
                      />
                      <Label htmlFor={`custom-shipping-${index}`}>Custom Shipping Price</Label>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <h5 className="font-semibold text-sm">Price Breakdown</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span>₹{variant.price.base_price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping:</span>
                          <span>₹{variant.price.shipping_price.value.toFixed(2)}</span>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span>₹{variant.price.total_price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>MRP:</span>
                          <span>₹{variant.price.mrp.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Stock Section */}
                  {/* <div className="space-y-4">
                    <h4 className="font-semibold">Stock</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`current-stock-${index}`}>Current Stock</Label>
                        <Input
                          id={`current-stock-${index}`}
                          type="number"
                          value={variant.stock.current}
                          onChange={(e) =>
                            updateNestedField(index, ["stock", "current"], Number(e.target.value))
                          }
                          placeholder="Enter current stock"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`minimum-stock-${index}`}>Minimum Stock</Label>
                        <Input
                          id={`minimum-stock-${index}`}
                          type="number"
                          value={variant.stock.minimum}
                          onChange={(e) =>
                            updateNestedField(index, ["stock", "minimum"], Number(e.target.value))
                          }
                          placeholder="Enter minimum stock"
                        />
                      </div>
                    </div>
                  </div> */}

                  <Separator />

                  {/* Power Range Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Power Range</h4>

                    {/* Spherical (all types) */}
                    <div>
                      <Label className="text-sm font-medium mb-2">Spherical Power</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`spherical-min-${index}`}>Min Power</Label>
                          <Select
                            value={variant.power_range.spherical.min.toString()}
                            onValueChange={(value) =>
                              updateNestedField(
                                index,
                                ["power_range", "spherical", "min"],
                                Number(value)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select min power" />
                            </SelectTrigger>
                            <SelectContent>
                              {sphericalPowers.map((power) => (
                                <SelectItem
                                  key={`min-${power.value}`}
                                  value={power.value.toString()}
                                >
                                  {power.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`spherical-max-${index}`}>Max Power</Label>
                          <Select
                            value={variant.power_range.spherical.max.toString()}
                            onValueChange={(value) =>
                              updateNestedField(
                                index,
                                ["power_range", "spherical", "max"],
                                Number(value)
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select max power" />
                            </SelectTrigger>
                            <SelectContent>
                              {sphericalPowers.map((power) => (
                                <SelectItem
                                  key={`max-${power.value}`}
                                  value={power.value.toString()}
                                >
                                  {power.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Cylindrical (toric only) */}
                    {lensType === "toric" && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Cylindrical Power</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`cylindrical-min-${index}`}>Min Power</Label>
                            <Select
                              value={(variant.power_range.cylindrical?.min || -10).toString()}
                              onValueChange={(value) =>
                                updateNestedField(
                                  index,
                                  ["power_range", "cylindrical", "min"],
                                  Number(value)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select min power" />
                              </SelectTrigger>
                              <SelectContent>
                                {cylindricalPowers
                                  .filter((p) => p.value <= 0)
                                  .map((power) => (
                                    <SelectItem
                                      key={`cyl-min-${power.value}`}
                                      value={power.value.toString()}
                                    >
                                      {power.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`cylindrical-max-${index}`}>Max Power</Label>
                            <Select
                              value={(variant.power_range.cylindrical?.max || 0).toString()}
                              onValueChange={(value) =>
                                updateNestedField(
                                  index,
                                  ["power_range", "cylindrical", "max"],
                                  Number(value)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select max power" />
                              </SelectTrigger>
                              <SelectContent>
                                {cylindricalPowers
                                  .filter((p) => p.value <= 0)
                                  .map((power) => (
                                    <SelectItem
                                      key={`cyl-max-${power.value}`}
                                      value={power.value.toString()}
                                    >
                                      {power.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Addition (multi_focal only) */}
                    {lensType === "multi_focal" && (
                      <div>
                        <Label className="text-sm font-medium mb-2">Addition Power</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`addition-min-${index}`}>Min Power</Label>
                            <Select
                              value={(variant.power_range.addition?.min || 1).toString()}
                              onValueChange={(value) =>
                                updateNestedField(
                                  index,
                                  ["power_range", "addition", "min"],
                                  Number(value)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select min power" />
                              </SelectTrigger>
                              <SelectContent>
                                {additionPowers.map((power) => (
                                  <SelectItem
                                    key={`add-min-${power.value}`}
                                    value={power.value.toString()}
                                  >
                                    {power.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`addition-max-${index}`}>Max Power</Label>
                            <Select
                              value={(variant.power_range.addition?.max || 5).toString()}
                              onValueChange={(value) =>
                                updateNestedField(
                                  index,
                                  ["power_range", "addition", "max"],
                                  Number(value)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select max power" />
                              </SelectTrigger>
                              <SelectContent>
                                {additionPowers.map((power) => (
                                  <SelectItem
                                    key={`add-max-${power.value}`}
                                    value={power.value.toString()}
                                  >
                                    {power.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Images */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Variant Images</Label>
                      <ImageUploader
                        images={variant.images.map((img) => img.url)}
                        onChange={(urls) => handleImageChange(index, urls)}
                        uploadFunction={uploadFunction}
                        maxImages={5}
                        buttonLabel={
                          variant.images.length > 0 ? "Add More Images" : "Upload Variant Images"
                        }
                      />
                    </div>
                    {variant.images.length > 0 && (
                      <ImageSection
                        images={variant.images.map((img) => img.url)}
                        onChange={(urls) => handleImageSectionChange(index, urls)}
                        getSignedUrl={async (path: string) => {
                          const { getSignedViewUrl } = await import("@/actions/cloud-storage");
                          return getSignedViewUrl(path);
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
