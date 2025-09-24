"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VendorBusinessDetailsSchema, VendorBusinessDetailsType } from "@/lib/validations";
import { uploadFilesToCloud } from "@/lib/cloud-storage";
import { toast } from "sonner";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessDetailsStepProps {
  onComplete: (data: VendorBusinessDetailsType) => void;
  onBack: () => void;
  initialData: VendorBusinessDetailsType | null;
  phoneNumber: string;
}

export default function BusinessDetailsStep({
  onComplete,
  onBack,
  initialData,
  phoneNumber,
}: BusinessDetailsStepProps) {
  const [formData, setFormData] = useState({
    business_name: initialData?.business_name || "",
    gst_number: initialData?.gst_number || "",
    address: {
      address_line_1: initialData?.address?.address_line_1 || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      pincode: initialData?.address?.pincode || "",
    },
    categories: initialData?.categories || [],
    logo: initialData?.logo || "",
    banner: initialData?.banner || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev.address],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = VendorBusinessDetailsSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldPath = issue.path.join(".");
        newErrors[fieldPath] = issue.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    onComplete(result.data);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Phone: {phoneNumber}</span>
        <span className="text-green-500">✓ Verified</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange("business_name", e.target.value)}
                  placeholder="Enter your business name"
                  className={errors.business_name ? "border-red-500" : ""}
                />
                {errors.business_name && (
                  <p className="text-sm text-red-500">{errors.business_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_number">GST Number *</Label>
                <Input
                  id="gst_number"
                  value={formData.gst_number}
                  onChange={(e) => handleInputChange("gst_number", e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  className={errors.gst_number ? "border-red-500" : ""}
                />
                {errors.gst_number && <p className="text-sm text-red-500">{errors.gst_number}</p>}
              </div>
            </div>

            {/* Image Uploads */}
           
          </CardContent>
        </Card>

        {/* Address Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PickUp details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address_line_1">Address Line 1 *</Label>
              <Textarea
                id="address_line_1"
                value={formData.address.address_line_1}
                onChange={(e) => handleInputChange("address.address_line_1", e.target.value)}
                placeholder="123 Main Street, Building Name"
                className={errors["address.address_line_1"] ? "border-red-500" : ""}
              />
              {errors["address.address_line_1"] && (
                <p className="text-sm text-red-500">{errors["address.address_line_1"]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  placeholder="Enter city"
                  className={errors["address.city"] ? "border-red-500" : ""}
                />
                {errors["address.city"] && (
                  <p className="text-sm text-red-500">{errors["address.city"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  placeholder="Enter state"
                  className={errors["address.state"] ? "border-red-500" : ""}
                />
                {errors["address.state"] && (
                  <p className="text-sm text-red-500">{errors["address.state"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange("address.pincode", e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className={errors["address.pincode"] ? "border-red-500" : ""}
                />
                {errors["address.pincode"] && (
                  <p className="text-sm text-red-500">{errors["address.pincode"]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Bank Details"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
