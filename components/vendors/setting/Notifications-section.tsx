"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useActionState } from "react"
import { toast } from "sonner"
import { updateVendor } from "@/actions/vendors/vendors"
import { Switch } from "@/components/ui/switch"

interface NotificationsSectionProps {
  vendor: any
}

export default function NotificationsSection({ vendor }: NotificationsSectionProps) {
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
        toast.success("Notification settings updated successfully!")
        return { success: true }
      } else {
        toast.error("Failed to update notification settings")
        return { success: false }
      }
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast.error("An error occurred")
      return { success: false }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSave, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications & Alerts</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Email Notifications</h3>
            <div className="space-y-3 ml-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_orders" className="cursor-pointer">
                  New Orders
                </Label>
                <Switch
                  id="email_orders"
                  checked={formData?.notifications?.email_new_orders}
                  onCheckedChange={(checked) => handleNestedChange("notifications", "email_new_orders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email_returns" className="cursor-pointer">
                  Returns & Refunds
                </Label>
                <Switch
                  id="email_returns"
                  checked={formData?.notifications?.email_returns}
                  onCheckedChange={(checked) => handleNestedChange("notifications", "email_returns", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email_payouts" className="cursor-pointer">
                  Payouts
                </Label>
                <Switch
                  id="email_payouts"
                  checked={formData?.notifications?.email_payouts}
                  onCheckedChange={(checked) => handleNestedChange("notifications", "email_payouts", checked)}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-muted-foreground">Other Notifications</h3>
            <div className="space-y-3 ml-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms_notifications" className="cursor-pointer">
                  SMS Notifications
                </Label>
                <Switch
                  id="sms_notifications"
                  checked={formData?.notifications?.sms_notifications}
                  onCheckedChange={(checked) => handleNestedChange("notifications", "sms_notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="app_notifications" className="cursor-pointer">
                  App Notifications
                </Label>
                <Switch
                  id="app_notifications"
                  checked={formData?.notifications?.app_notifications}
                  onCheckedChange={(checked) => handleNestedChange("notifications", "app_notifications", checked)}
                />
              </div>
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
