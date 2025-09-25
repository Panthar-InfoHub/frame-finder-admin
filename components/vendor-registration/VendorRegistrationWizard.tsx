"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PersonalDetailsStep from "./PersonalDetailsStep";
import BusinessDetailsStep from "./BusinessDetailsStep";
import BankDetailsStep from "./BankDetailsStep";
import {
  VendorPersonalDetailsType,
  VendorBusinessDetailsType,
  VendorBankDetailsType,
} from "@/lib/validations";

export interface RegistrationData {
  personalDetails: VendorPersonalDetailsType | null;
  businessDetails: VendorBusinessDetailsType | null;
  bankDetails: VendorBankDetailsType | null;
  isPhoneVerified: boolean;
}

const steps = [
  { title: "Personal Details", description: "Basic information and phone verification" },
  { title: "Business Details", description: "Business information and address" },
  { title: "Bank Details", description: "Banking information for transactions" },
];

export default function VendorRegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    personalDetails: null,
    businessDetails: null,
    bankDetails: null,
    isPhoneVerified: false,
  });

  const handlePersonalDetailsComplete = (data: VendorPersonalDetailsType) => {
    setRegistrationData((prev) => ({
      ...prev,
      personalDetails: data,
      isPhoneVerified: true,
    }));
    setCurrentStep(1);
  };

  const handleBusinessDetailsComplete = (data: VendorBusinessDetailsType) => {
    setRegistrationData((prev) => ({
      ...prev,
      businessDetails: data,
    }));
    setCurrentStep(2);
  };

  const handleBankDetailsComplete = (data: VendorBankDetailsType) => {
    setRegistrationData((prev) => ({
      ...prev,
      bankDetails: data,
    }));
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Vendor Registration</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center">
              <h3 className="font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <PersonalDetailsStep
              onComplete={handlePersonalDetailsComplete}
              initialData={registrationData.personalDetails}
            />
          )}
          {currentStep === 1 && (
            <BusinessDetailsStep
              onComplete={handleBusinessDetailsComplete}
              onBack={handleGoBack}
              initialData={registrationData.businessDetails}
              phoneNumber={registrationData.personalDetails?.phone || ""}
            />
          )}
          {currentStep === 2 && (
            <BankDetailsStep
              onComplete={handleBankDetailsComplete}
              onBack={handleGoBack}
              initialData={registrationData.bankDetails}
              registrationData={registrationData}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
