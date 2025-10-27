"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useActionState } from "react"
import { toast } from "sonner"
import { updateVendor } from "@/actions/vendors/vendors"
import { Switch } from "@/components/ui/switch"

interface ShippingSectionProps {
  vendor: any
}

export default function ShippingSection({ vendor }: ShippingSectionProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(vendor)

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
        toast.success("Shipping settings updated successfully!")
        return { success: true }
      } else {
        toast.error("Failed to update shipping settings")
        return { success: false }
      }
    } catch (error) {
      console.error("Error updating shipping settings:", error)
      toast.error("An error occurred")
      return { success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSave, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Delivery Settings</CardTitle>
        <CardDescription>Configure your shipping preferences and addresses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="courier">Preferred Courier Partner</Label>
            <Select
              value={formData?.shipping?.preferred_courier}
              onValueChange={(value) => handleNestedChange("shipping", "preferred_courier", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select courier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shiprocket">Shiprocket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <div className="space-y-1 flex items-center gap-3.5">
              <Label htmlFor="shipping_charges" className="font-medium cursor-pointer">
                Setup Shipping Charges
              </Label>
              <Switch
                id="shipping_charges"
                checked={formData?.shipping?.shipping_charges_setup}
                onCheckedChange={(checked) => handleNestedChange("shipping", "shipping_charges_setup", checked)}
              />

            </div>
            <p className="text-sm text-muted-foreground ml-6">
              If yes ,then (Shipping Charges will be deducted from your payout. If you don't want to charge shipping seperately, it will be included In the products final price shown to customers.) <br /> If no. then (Shipping Charges will be included in the Product's final price shown to customers and will not be deducted from your payout.)
            </p>

            {formData?.shipping?.shipping_charges_setup && (
              <div className="space-y-2 mt-4 pt-4 border-t">
                <Label htmlFor="custom_shipping_charge">Custom Shipping Charge (₹)</Label>
                <Input
                  id="custom_shipping_charge"
                  type="number"
                  step="0.01"
                  value={formData.shipping.custom_shipping_charge || ""}
                  onChange={(e) =>
                    handleNestedChange("shipping", "custom_shipping_charge", Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter shipping charge amount"
                />
              </div>
            )}

          </div>

          <div className="space-y-2">
            <Label htmlFor="return_address">Return Address</Label>
            <Input
              id="return_address"
              value={formData?.shipping?.return_address}
              onChange={(e) => handleNestedChange("shipping", "return_address", e.target.value)}
              placeholder="Enter return address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup_address">Pickup Address</Label>
            <Input
              id="pickup_address"
              value={formData?.shipping?.pickup_address}
              onChange={(e) => handleNestedChange("shipping", "pickup_address", e.target.value)}
              placeholder="Enter pickup address"
            />
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
