"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSignedViewUrl } from "@/actions/cloud-storage";
import Image from "next/image";

interface FrameVariant {
  _id: string;
  frame_color: string;
  temple_color: string;
  price: {
    base_price: number;
    mrp: number;
    shipping_price: {
      value: number;
      custom: boolean;
    };
    total_price: number;
  };
  stock: {
    current: number;
    minimum: number;
  };
  images: { url: string }[];
}

interface FrameVariantsDisplayProps {
  variants: FrameVariant[];
  brandName: string;
  initialVariantId?: string;
}

export default function FrameVariantsDisplay({
  variants,
  brandName,
  initialVariantId,
}: FrameVariantsDisplayProps) {
  const [selectedVariant, setSelectedVariant] = useState<FrameVariant>(
    variants.find((v) => v._id === initialVariantId) || variants[0]
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoadingImages(true);
      if (selectedVariant?.images && selectedVariant.images.length > 0) {
        const urls = await Promise.all(
          selectedVariant.images.map((img) => getSignedViewUrl(img.url))
        );
        setImageUrls(urls);
      } else {
        setImageUrls([]);
      }
      setLoadingImages(false);
    };

    loadImages();
  }, [selectedVariant]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Variants ({variants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Variant Selection Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {variants.map((variant, index) => (
            <Button
              key={variant._id}
              onClick={() => setSelectedVariant(variant)}
              variant={selectedVariant._id === variant._id ? "default" : "outline"}
              className="h-auto py-2"
            >
              Variant {index + 1}
            </Button>
          ))}
        </div>

        {/* Selected Variant Details */}
        <div className="space-y-6">
          {/* Images Gallery */}
          {loadingImages ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((imageUrl, imgIndex) => (
                <div
                  key={imgIndex}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${brandName} - Image ${imgIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No images available for this variant
            </div>
          )}

          {/* Variant Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Frame Color</p>
              <Badge variant="outline" className="text-sm">
                {selectedVariant.frame_color}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Temple Color</p>
              <Badge variant="outline" className="text-sm">
                {selectedVariant.temple_color}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Discounted Price</p>
              <p className="text-xl font-bold">₹{selectedVariant.price.base_price}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">MRP</p>
              <p className="text-xl font-semibold">₹{selectedVariant.price.mrp}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Shipping Price</p>
              <p className="font-medium">₹{selectedVariant.price.shipping_price.value}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="font-medium">₹{selectedVariant.price.total_price}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{selectedVariant.stock.current} units</p>
                <Badge
                  variant={
                    selectedVariant.stock.current > selectedVariant.stock.minimum
                      ? "default"
                      : "destructive"
                  }
                >
                  {selectedVariant.stock.current > selectedVariant.stock.minimum
                    ? "In Stock"
                    : "Low Stock"}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Minimum Stock</p>
              <p className="font-medium">{selectedVariant.stock.minimum} units</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
