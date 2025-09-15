"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerVendor } from "@/actions/vendors/vendors";

export function VendorRegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await registerVendor(formData);

      if (!result.success) {
        toast.error(result.message || "Registration failed");
        return;
      }
      toast.success(result.message || "Registration successful");
      router.push("/dashboard");
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" autoComplete="on">
        {/* Business Name - spans 2 columns */}
        <div className="col-span-1 space-y-2">
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
        </div>

        {/* Business Owner - spans 2 columns */}
        <div className="col-span-1 space-y-2">
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
        </div>

        {/* Business Logo - 1 column */}
        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="logo">
            Business Logo (Optional)
          </label>
          <Input id="logo" name="logo" type="file" accept="image/*" />
        </div>

        {/* Business Banner - 1 column */}
        <div className="space-y-2">
          <label className="text-sm text-gray-500" htmlFor="banner">
            Business Banner (Optional)
          </label>
          <Input id="banner" name="banner" type="file" accept="image/*" />
        </div>

        {/* Submit Button - spans 2 columns */}
        <div className="col-span-2 pt-4">
          <Button type="submit" className="w-full " disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Vendor"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
