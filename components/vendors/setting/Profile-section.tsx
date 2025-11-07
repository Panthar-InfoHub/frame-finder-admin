"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Loader2, ImageIcon } from "lucide-react"
import { useActionState } from "react"
import { toast } from "sonner"
import { updateVendor } from "@/actions/vendors/vendors"
import { ImageUploader } from "@/components/ui/custom/ImageUploader"
import { uploadFilesToCloud } from "@/lib/cloud-storage"
import { ImageSection } from "@/components/ui/custom/ImageSection"
import { getSignedViewUrl } from "@/actions/cloud-storage"
import { Checkbox } from "@/components/ui/checkbox"

interface ProfileSectionProps {
  vendor: any
}

const ImageUploadFunction = async (files: File[]): Promise<string[]> => {
  const { success, failed } = await uploadFilesToCloud({
    files,
    folder: { rootFolder: "vendor", folderName: "logo" },
  });
  toast(`Uploaded ${success.length} images successfully, Failed - ${failed.length}`);
  return success.map((item) => item.path);
};

const CategoryOptions = [
  { value: "Product", label: "Frames" },
  { value: "ContactLens", label: "Contact Lens" },
  { value: "ColorContactLens", label: "Color Contact Lens" },
  { value: "Reader", label: "Reader Glasses" },
  { value: "Sunglasses", label: "Sunglasses" },
  { value: "LensSolution", label: "Lens Solution" },
  { value: "Accessories", label: "Accessories" },
];

export default function ProfileSection({ vendor }: ProfileSectionProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(vendor)
  console.log("Vendor Data:", vendor);

  const handleInputChange = (field: string, value: any) => {
    if (field === "categories") {
      setFormData((prev: any) => {
        const categories = prev.categories.includes(value)
          ? prev.categories.filter((item: string) => item !== value)
          : [...prev.categories, value];
        return { ...prev, categories };
      });

    } else {
      setFormData((prev: any) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  const handleSave = async (prevState: any, formDataObj: FormData) => {
    try {
      const result = await updateVendor(vendor._id, formData)
      if (result.success) {
        router.refresh()
        toast.success("Profile updated successfully!")
        return { success: true }
      } else {
        toast.error("Failed to update profile")
        return { success: false }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("An error occurred")
      return { success: false }
    }
  }

  const handleImageSectionChange = (field: string, newImageUrls: string[]) => {
    handleInputChange(field, newImageUrls);
  };

  const [state, formAction, isPending] = useActionState(handleSave, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Business Information</CardTitle>
        <CardDescription>Update your business details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">

            {/* LOGO */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <ImageUploader
                images={formData.logo}
                onChange={(urls) => handleInputChange("logo", urls[0])}
                uploadFunction={ImageUploadFunction}
                maxImages={1}
                buttonLabel="Add Logo"
              />
              {/* Image Gallery */}
              {formData.logo && (
                <div className="mb-3">
                  <ImageSection
                    images={[formData.logo]}
                    getSignedUrl={getSignedViewUrl}
                    onChange={(newUrls) => handleImageSectionChange("logo", newUrls)}
                  />
                </div>
              )}

              {/* No Images UI */}
              {!formData.logo && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-3">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images uploaded</p>
                </div>
              )}
            </div>
            {/* BANNER */}
            <div className="space-y-2">
              <Label htmlFor="banner">Banner</Label>
              <ImageUploader
                images={formData.banner}
                onChange={(urls) => handleInputChange("banner", urls[0])}
                uploadFunction={ImageUploadFunction}
                maxImages={1}
                buttonLabel="Add Banner"
              />
              {/* Image Gallery */}
              {formData.banner && (
                <div className="mb-3">
                  <ImageSection
                    images={[formData.banner]}
                    getSignedUrl={getSignedViewUrl}
                    onChange={(newUrls) => handleImageSectionChange("banner", newUrls)}
                  />
                </div>
              )}

              {/* No Images UI */}
              {!formData.banner && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mb-3">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images uploaded</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange("business_name", e.target.value)}
                placeholder="Enter business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_owner">Owner Name</Label>
              <Input
                id="business_owner"
                value={formData.business_owner}
                onChange={(e) => handleInputChange("business_owner", e.target.value)}
                placeholder="Enter owner name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line_1">Registered Business Address</Label>
            <Input
              id="address_line_1"
              value={formData.address.address_line_1}
              onChange={(e) => handleNestedChange("address", "address_line_1", e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.address.pincode}
                onChange={(e) => handleNestedChange("address", "pincode", e.target.value)}
                placeholder="Pincode"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gst">GST / Business Registration Number</Label>
              <Input
                id="gst"
                value={formData.gst_number}
                onChange={(e) => handleInputChange("gst_number", e.target.value)}
                placeholder="Enter GST number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Choose Categories</Label>
            <div className="flex flex-wrap gap-2">
              {CategoryOptions.map((category) => {
                const isChecked = formData.categories.includes(category.value)
                return (
                  <div key={category.value} className="flex items-center space-x-2 ">
                    <Checkbox id={category.value} name="categories" value={category.value} checked={isChecked} onCheckedChange={(checked) => handleInputChange("categories", category.value)} />
                    <Label htmlFor={category.value} >{category.value}</Label>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
