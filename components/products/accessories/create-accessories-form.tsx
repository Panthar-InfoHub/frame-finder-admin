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
import { createAccessoryAction } from "@/actions/vendors/products";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { normalizeObject } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { AccessorySchema } from "@/lib/validations";
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

export default function AddAccessoriesForm() {
  const sizes = ["S", "M", "L", "XL"];
  const materialOptions = [
    "plastic",
    "metal",
    "fabric",
    "leather",
    "microfiber",
    "silicone",
    "rubber",
  ];

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  // Pricing state
  const [basePrice, setBasePrice] = useState<number>(0);
  const [mrp, setMrp] = useState<number>(0);
  const [customShipping, setCustomShipping] = useState<boolean>(false);
  const [shippingPrice, setShippingPrice] = useState<number>(100);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Auto calculate total price
  React.useEffect(() => {
    const shipping = customShipping ? shippingPrice : 100;
    setTotalPrice(mrp + shipping);
  }, [mrp, customShipping, shippingPrice]);

  const handleImageChange = (imageUrls: string[]) => {
    setImages(imageUrls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formdata = new FormData(e.currentTarget);
    const basicData = normalizeObject(formdata, ["hsn_code", "productCode"]);

    const completeData = {
      ...basicData,
      material: selectedMaterials,
      sizes: selectedSizes,
      images: images.map((url) => ({ url })),
      price: {
        base_price: Number(basicData.base_price),
        mrp: Number(basicData.mrp),
        total_price: Number(basicData.total_price || basicData.base_price),
      },
      stock: {
        current: Number(basicData.current_stock || 0),
        minimum: Number(basicData.minimum_stock || 5),
      },
    };

    // Remove duplicate price fields
    delete (completeData as any).base_price;
    delete (completeData as any).mrp;
    delete (completeData as any).total_price;
    delete (completeData as any).current_stock;
    delete (completeData as any).minimum_stock;

    const result = AccessorySchema.safeParse(completeData);
    if (!result.success) {
      console.error("Validation errors:", result.error.flatten());
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      toast.error(firstError || "Please fix the form errors");
      return;
    }

    startTransition(async () => {
      const response = await createAccessoryAction(result.data);
      if (response.success) {
        toast.success(response.message);
        router.push("/dashboard/products/accessories");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <BackButton href="/dashboard/products/accessories" className="mb-4">
        Back to Accessories
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
                  placeholder="ACC001"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  placeholder="Ray-Ban Cleaning Kit"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="hsn_code">HSN Code</Label>
                <Input
                  id="hsn_code"
                  name="hsn_code"
                  placeholder="9004.10.00"
                  required
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="origin_country">Country of Origin</Label>
                <Input
                  id="origin_country"
                  name="origin_country"
                  placeholder="India"
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Specifications */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Specifications</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Materials</Label>
                <MultiSelect values={selectedMaterials} onValuesChange={setSelectedMaterials}>
                  <MultiSelectTrigger disabled={isPending}>
                    <MultiSelectValue placeholder="Select materials" />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {materialOptions.map((material) => (
                      <MultiSelectItem key={material} value={material}>
                        {material.charAt(0).toUpperCase() + material.slice(1)}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label>Sizes</Label>
                <MultiSelect values={selectedSizes} onValuesChange={setSelectedSizes}>
                  <MultiSelectTrigger disabled={isPending}>
                    <MultiSelectValue placeholder="Select sizes" />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {sizes.map((size) => (
                      <MultiSelectItem key={size} value={size}>
                        {size}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              <div>
                <Label htmlFor="mfg_date">Manufacturing Date</Label>
                <Input id="mfg_date" name="mfg_date" type="date" disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="exp">Expiry Date</Label>
                <Input id="exp" name="exp" type="date" disabled={isPending} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Pricing</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_price" className="text-xs">
                  Base Price (₹)
                </Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  step="0.01"
                  placeholder="Enter base price"
                  required
                  disabled={isPending}
                  value={basePrice || ""}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mrp" className="text-xs">
                  MRP (₹)
                </Label>
                <Input
                  id="mrp"
                  name="mrp"
                  type="number"
                  step="0.01"
                  placeholder="Enter MRP"
                  required
                  disabled={isPending}
                  value={mrp || ""}
                  onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="shipping_price" className="text-xs">
                    Shipping Price (₹)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Label
                      htmlFor="custom-shipping"
                      className="text-xs text-muted-foreground cursor-pointer"
                    >
                      Custom
                    </Label>
                    <Switch
                      id="custom-shipping"
                      checked={customShipping}
                      onCheckedChange={setCustomShipping}
                      disabled={isPending}
                    />
                  </div>
                </div>
                <Input
                  id="shipping_price"
                  name="shipping_price"
                  type="number"
                  value={customShipping ? shippingPrice : 100}
                  onChange={(e) => setShippingPrice(parseFloat(e.target.value) || 0)}
                  placeholder={customShipping ? "Enter shipping price" : "Default shipping"}
                  min="0"
                  step="0.01"
                  disabled={!customShipping || isPending}
                  className={`mt-1 ${
                    !customShipping ? "bg-muted text-muted-foreground cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Total Price */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="total_price" className="text-xs">
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
                              <span className="font-medium">₹{basePrice || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">MRP:</span>
                              <span className="font-medium">₹{mrp || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Shipping:</span>
                              <span className="font-medium">
                                ₹{customShipping ? shippingPrice : 100}
                                {!customShipping && (
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
                                  ₹{totalPrice || 0}
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
                  id="total_price"
                  name="total_price"
                  type="number"
                  value={totalPrice || ""}
                  placeholder="Auto calculated"
                  disabled
                  className="mt-1 bg-muted cursor-not-allowed"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Stock</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_stock">Current Stock</Label>
                <Input
                  id="current_stock"
                  name="current_stock"
                  type="number"
                  placeholder="150"
                  defaultValue="0"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="minimum_stock">Minimum Stock</Label>
                <Input
                  id="minimum_stock"
                  name="minimum_stock"
                  type="number"
                  placeholder="20"
                  defaultValue="5"
                  disabled={isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Product Images</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <ImageUploader
                images={images}
                onChange={handleImageChange}
                uploadFunction={ImageUploadFunction}
                maxImages={10}
                buttonLabel="Add Images"
              />
              <span className="text-sm text-muted-foreground">{images.length} image(s)</span>
            </div>

            {images.length > 0 && (
              <ImageSection
                images={images}
                getSignedUrl={getSignedViewUrl}
                onChange={handleImageChange}
              />
            )}
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
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Accessory
          </Button>
        </div>
      </form>
    </div>
  );
}
