"use client"

import { updateVendor } from "@/actions/vendors/vendors"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useState } from "react"
import { toast } from "sonner"

interface BankPaymentsSectionProps {
    vendor: any
}

export default function BankPaymentsSection({ vendor }: BankPaymentsSectionProps) {
    const router = useRouter()
    const [data, setData] = useState(vendor)

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }))
    }

    const handleInputChange = (field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSave = async (prevData: any, formData: FormData) => {
        try {
            const result = await updateVendor(data._id, data)
            if (result.success) {
                router.refresh()
                toast.success("Vendor details updated successfully!")
            } else {
                toast.warning("Failed to update vendor details.")
            }
        } catch (error) {
            console.error("Error updating vendor details:", error)
            toast.error("An error occurred while updating vendor details.")
        }
    }

    const [state, formAction, isPending] = useActionState(handleSave, {})

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bank & Payments Details</CardTitle>
                <CardDescription>Manage your bank account and payment preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <form action={formAction} className="space-y-6" >
                    <div className="space-y-2">
                        <Label htmlFor="account_holder">Account Holder Name</Label>
                        <Input
                            id="account_holder"
                            value={data?.bank_details?.account_holder_name}
                            onChange={(e) => handleNestedChange("bank_details", "account_holder_name", e.target.value)}
                            placeholder="Enter account holder name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Bank Name & Branch</Label>
                            <Input
                                id="bank_name"
                                value={data?.bank_details?.bank_name}
                                onChange={(e) => handleNestedChange("bank_details", "bank_name", e.target.value)}
                                placeholder="Enter bank name and branch"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account_number">Account Number</Label>
                            <Input
                                id="account_number"
                                value={data?.bank_details?.account_number}
                                onChange={(e) => handleNestedChange("bank_details", "account_number", e.target.value)}
                                placeholder="Enter account number"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code</Label>
                        <Input
                            id="ifsc"
                            value={data?.bank_details?.ifsc_code}
                            onChange={(e) => handleNestedChange("bank_details", "ifsc_code", e.target.value)}
                            placeholder="Enter IFSC code"
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <Label className="text-base font-semibold">Payment Preferences</Label>
                        <Select
                            value={data.payment_preferences}
                            onValueChange={(value) => handleInputChange("payment_preferences", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payout frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-slate-600">Choose how often you want to receive payouts</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="submit" className="gap-2" disabled={isPending} >
                            <Save className="h-4 w-4" />
                            {isPending ? <> <Loader2 className="animate-spin" /> Saving...  </> : "Save Changes"}
                        </Button>
                    </div>
                </form>

            </CardContent>
        </Card>
    )
}
