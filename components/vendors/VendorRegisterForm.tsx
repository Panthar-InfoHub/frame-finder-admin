"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { registerVendor } from "@/actions/vendors/create-vendor"
import { Alert, AlertDescription } from "../ui/alert"

export function VendorRegistrationForm() {
    const [state, formAction, isPending] = useActionState(registerVendor, {
        success: false,
        message: "",
        errors: {},
    })

    return (
        <div className="w-full space-y-6">
            {state.success && (
                <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                </Alert>
            )}

            {state.message && !state.success && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                </Alert>
            )}

            <form action={formAction} className="grid grid-cols-2 gap-4" autoComplete="on">
                {/* Business Name - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="business_name">
                        Business Name
                    </label>
                    <Input
                        id="business_name"
                        name="business_name"
                        placeholder="Enter your business name"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.business_name && (
                        <p className="text-sm text-red-500">{state.errors.business_name}</p>
                    )}
                </div>

                {/* Business Owner - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="business_owner">
                        Business Owner
                    </label>
                    <Input
                        id="business_owner"
                        name="business_owner"
                        placeholder="Enter owner's full name"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.business_owner && (
                        <p className="text-sm text-red-500">{state.errors.business_owner}</p>
                    )}
                </div>

                {/* GST Number - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="gst_number">
                        GST Number
                    </label>
                    <Input
                        id="gst_number"
                        name="gst_number"
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.gst_number && (
                        <p className="text-sm text-red-500">{state.errors.gst_number}</p>
                    )}
                </div>

                {/* Email - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="email">
                        Email Address
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="business@example.com"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.email && (
                        <p className="text-sm text-red-500">{state.errors.email}</p>
                    )}
                </div>

                {/* Phone - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="phone">
                        Phone Number
                    </label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="9876543210"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.phone && (
                        <p className="text-sm text-red-500">{state.errors.phone}</p>
                    )}
                </div>

                {/* Password - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="password">
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a strong password"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.password && (
                        <p className="text-sm text-red-500">{state.errors.password}</p>
                    )}
                </div>

                {/* Address - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="address_line_1">
                        Address
                    </label>
                    <Input
                        id="address_line_1"
                        name="address_line_1"
                        placeholder="123 Main Street"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.address_line_1 && (
                        <p className="text-sm text-red-500">{state.errors.address_line_1}</p>
                    )}
                </div>

                {/* City - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="city">
                        City
                    </label>
                    <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.city && (
                        <p className="text-sm text-red-500">{state.errors.city}</p>
                    )}
                </div>

                {/* State - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="state">
                        State
                    </label>
                    <Input
                        id="state"
                        name="state"
                        placeholder="State"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.state && (
                        <p className="text-sm text-red-500">{state.errors.state}</p>
                    )}
                </div>

                {/* Pincode - spans 2 columns */}
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="pincode">
                        Pincode
                    </label>
                    <Input
                        id="pincode"
                        name="pincode"
                        placeholder="123456"
                        className="w-full p-2 border rounded"
                        required
                    />
                    {state.errors?.pincode && (
                        <p className="text-sm text-red-500">{state.errors.pincode}</p>
                    )}
                </div>

                {/* Business Logo - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="logo">
                        Business Logo (Optional)
                    </label>
                    <Input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                    />
                    {state.errors?.logo && (
                        <p className="text-sm text-red-500">{state.errors.logo}</p>
                    )}
                </div>

                {/* Business Banner - 1 column */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-500" htmlFor="banner">
                        Business Banner (Optional)
                    </label>
                    <Input
                        id="banner"
                        name="banner"
                        type="file"
                        accept="image/*"
                    />
                    {state.errors?.banner && (
                        <p className="text-sm text-red-500">{state.errors.banner}</p>
                    )}
                </div>

                {/* Submit Button - spans 2 columns */}
                <div className="col-span-2 pt-4">
                    <Button
                        type="submit"
                        className="w-full "
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            "Register Business"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
