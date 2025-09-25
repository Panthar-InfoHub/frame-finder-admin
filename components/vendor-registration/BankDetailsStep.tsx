"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  VendorBankDetailsSchema,
  VendorBankDetailsType,
  VendorCompleteRegistrationSchema,
} from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RegistrationData } from "./VendorRegistrationWizard";
import { useRouter } from "next/navigation";
import { completeVendorRegistration } from "@/actions/vendors/complete-registration";

interface BankDetailsStepProps {
  onComplete: (data: VendorBankDetailsType) => void;
  onBack: () => void;
  initialData: VendorBankDetailsType | null;
  registrationData: RegistrationData;
}

export default function BankDetailsStep({
  onComplete,
  onBack,
  initialData,
  registrationData,
}: BankDetailsStepProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formData, setFormData] = useState({
    bank_details: {
      account_holder_name: initialData?.bank_details?.account_holder_name || "",
      account_number: initialData?.bank_details?.account_number || "",
      ifsc_code: initialData?.bank_details?.ifsc_code || "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate bank details
    const bankResult = VendorBankDetailsSchema.safeParse(formData);

    if (!bankResult.success) {
      const newErrors: Record<string, string> = {};
      bankResult.error.issues.forEach((issue) => {
        const fieldPath = issue.path.join(".");
        newErrors[fieldPath] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    // Prepare complete registration data
    const completeData = {
      ...registrationData.personalDetails,
      ...registrationData.businessDetails,
      ...bankResult.data,
    };

    // Validate complete data
    const completeResult = VendorCompleteRegistrationSchema.safeParse(completeData);

    if (!completeResult.success) {
      toast.error("Please check all form fields and try again");
      console.error("Complete validation errors:", completeResult.error.issues);
      return;
    }

    startTransition(async () => {
      try {
        const result = await completeVendorRegistration(completeResult.data);

        if (result.success) {
          toast.success(result.message);
          router.push("/dashboard");
        } else {
          toast.error(result.message);
        }
      } catch (error: any) {
        toast.error("Registration failed. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Registration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Registration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Phone:</span> {registrationData.personalDetails?.phone}
            </div>
            <div>
              <span className="font-medium">Owner:</span>{" "}
              {registrationData.personalDetails?.business_owner}
            </div>
            <div>
              <span className="font-medium">Business:</span>{" "}
              {registrationData.businessDetails?.business_name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {registrationData.personalDetails?.email}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bank Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Bank Account Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This information will be used for payment settlements
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account_holder_name">Account Holder Name *</Label>
              <Input
                id="account_holder_name"
                value={formData.bank_details.account_holder_name}
                onChange={(e) => handleInputChange("account_holder_name", e.target.value)}
                placeholder="Enter account holder name"
                className={errors["bank_details.account_holder_name"] ? "border-red-500" : ""}
              />
              {errors["bank_details.account_holder_name"] && (
                <p className="text-sm text-red-500">{errors["bank_details.account_holder_name"]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number *</Label>
                <Input
                  id="account_number"
                  value={formData.bank_details.account_number}
                  onChange={(e) => handleInputChange("account_number", e.target.value)}
                  placeholder="Enter account number"
                  type="number"
                  className={errors["bank_details.account_number"] ? "border-red-500" : ""}
                />
                {errors["bank_details.account_number"] && (
                  <p className="text-sm text-red-500">{errors["bank_details.account_number"]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifsc_code">IFSC Code *</Label>
                <Input
                  id="ifsc_code"
                  value={formData.bank_details.ifsc_code}
                  onChange={(e) => handleInputChange("ifsc_code", e.target.value.toUpperCase())}
                  placeholder="Enter IFSC code"
                  maxLength={11}
                  className={errors["bank_details.ifsc_code"] ? "border-red-500" : ""}
                />
                {errors["bank_details.ifsc_code"] && (
                  <p className="text-sm text-red-500">{errors["bank_details.ifsc_code"]}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure all bank details are accurate for seamless transactions</li>
                <li>• Account holder name should match your business registration</li>
                <li>• IFSC code should be valid for your bank branch</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering Vendor...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
