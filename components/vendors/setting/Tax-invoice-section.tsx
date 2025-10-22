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

interface TaxInvoiceSectionProps {
  vendor: any
}

export default function TaxInvoiceSection({ vendor }: TaxInvoiceSectionProps) {
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
        toast.success("Tax settings updated successfully!")
        return { success: true }
      } else {
        toast.error("Failed to update tax settings")
        return { success: false }
      }
    } catch (error) {
      console.error("Error updating tax settings:", error)
      toast.error("An error occurred")
      return { success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSave, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax & Invoice Settings</CardTitle>
        <CardDescription>Manage tax calculations and invoice customization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gst_percentage">GST Percentage / Tax Setup</Label>
            <div className="flex items-center gap-2">
              <Input
                id="gst_percentage"
                type="number"
                value={formData?.tax_invoice?.gst_percentage}
                onChange={(e) => handleNestedChange("tax_invoice", "gst_percentage", Number.parseInt(e.target.value))}
                placeholder="Enter GST percentage"
                className="max-w-xs"
              />
              <span className="text-slate-600">%</span>
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto_tax"
                checked={formData?.tax_invoice?.auto_tax_calculation}
                onCheckedChange={(checked) => handleNestedChange("tax_invoice", "auto_tax_calculation", checked)}
              />
              <Label htmlFor="auto_tax" className="font-medium cursor-pointer">
                Enable Automatic Tax Calculation
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">Automatically calculate and apply taxes to all invoices</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice_format">Invoice Format Customization</Label>
            <Select
              value={formData?.tax_invoice?.invoice_format}
              onValueChange={(value) => handleNestedChange("tax_invoice", "invoice_format", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select invoice format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Format</SelectItem>
                <SelectItem value="detailed">Detailed Format</SelectItem>
                <SelectItem value="compact">Compact Format</SelectItem>
                <SelectItem value="custom">Custom Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full bg-transparent">
              Download Sample Invoice Template
            </Button>
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
