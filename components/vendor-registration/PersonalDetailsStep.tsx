"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput, PhoneValue } from "@/components/ui/custom/phone-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-config";
import { IsUserNumberVerified, VerifyOTP } from "@/actions/auth";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { VendorPersonalDetailsSchema, VendorPersonalDetailsType } from "@/lib/validations";

interface PersonalDetailsStepProps {
  onComplete: (data: VendorPersonalDetailsType) => void;
  initialData: VendorPersonalDetailsType | null;
}

type StepState = "enterPhone" | "sendingOtp" | "enterOtp" | "verifyingOtp" | "verified";

export default function PersonalDetailsStep({ onComplete, initialData }: PersonalDetailsStepProps) {
  const [stepState, setStepState] = useState<StepState>("enterPhone");
  const [phone, setPhone] = useState<PhoneValue>({
    e164: initialData?.phone || "",
    national: "",
    country: "",
  });
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    business_owner: initialData?.business_owner || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
  });
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA once
    if (!recaptchaRef.current && typeof window !== "undefined") {
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      });
      recaptchaRef.current.render().catch(console.error);
    }

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const handleSendOtp = async () => {
    if (!phone.e164 || !phone.national) {
      setErrors({ phone: "Please enter a valid phone number" });
      return;
    }

    setStepState("sendingOtp");
    setErrors({});

    try {
      // Check if user is already registered
      const userCheck = await IsUserNumberVerified(phone.national);
      console.log("isUserAlreadyVerified", userCheck);
      if (userCheck.success) {
        setIsUserRegistered(true);
        toast.success("Phone number is already registered. Continue filling the form.");
        setStepState("verified");
        return;
      }

      if (!recaptchaRef.current) {
        throw new Error("reCAPTCHA not initialized");
      }

      const result = await signInWithPhoneNumber(firebaseAuth, phone.e164, recaptchaRef.current);
      setConfirmationResult(result);
      setStepState("enterOtp");
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      toast.error(err.message || "Failed to send OTP");
      setErrors({ phone: "Failed to send OTP. Please try again." });
      setStepState("enterPhone");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrors({ otp: "Please enter the OTP" });
      return;
    }

    setStepState("verifyingOtp");
    setErrors({});

    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result available");
      }

      await confirmationResult?.confirm(otp);
      const otpResult = await VerifyOTP(phone.national);
      if (!otpResult.success) {
        throw new Error(otpResult.message || "OTP verification failed");
      }
      setStepState("verified");
      toast.success("Phone number verified successfully!");
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      toast.error("Invalid OTP. Please try again.");
      setErrors({ otp: "Invalid OTP. Please try again." });
      setStepState("enterOtp");
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stepState !== "verified") {
      toast.error("Please verify your phone number first");
      return;
    }

    const completeData = {
      phone: phone.national,
      ...formData,
    };

    const result = VendorPersonalDetailsSchema.safeParse(completeData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    onComplete(result.data);
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone Number Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">Phone Number Verification</Label>
            {stepState === "verified" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          </div>

          <div className="space-y-2">
            <PhoneInput
              value={phone.e164}
              onChange={setPhone}
              defaultCountry="IN"
              placeholder="Enter phone number"
              disabled={stepState === "verified"}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {stepState === "enterPhone" && (
            <Button type="button" onClick={handleSendOtp} disabled={!phone.e164} className="w-full">
              Send OTP
            </Button>
          )}

          {stepState === "sendingOtp" && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending OTP...
            </Button>
          )}

          {stepState === "enterOtp" && (
            <div className="space-y-2">
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className={errors.otp ? "border-red-500" : ""}
              />
              {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className="flex-1"
                >
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStepState("enterPhone")}
                  className="flex-1"
                >
                  Change Number
                </Button>
              </div>
            </div>
          )}

          {stepState === "verifyingOtp" && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying OTP...
            </Button>
          )}

          {/* {stepState === "verified" && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Phone number verified successfully</span>
            </div>
          )}

          {isUserRegistered && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">
                User already registered. Continue with form completion.
              </span>
            </div>
          )} */}
        </div>

        {/* Personal Details Form - Only show after phone verification */}
        {(stepState === "verified" || isUserRegistered) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_owner">Business Owner Name *</Label>
                <Input
                  id="business_owner"
                  value={formData.business_owner}
                  onChange={(e) => handleFormChange("business_owner", e.target.value)}
                  placeholder="Enter owner's full name"
                  className={errors.business_owner ? "border-red-500" : ""}
                />
                {errors.business_owner && (
                  <p className="text-sm text-red-500">{errors.business_owner}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="business@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleFormChange("password", e.target.value)}
                placeholder="Create a strong password"
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full">
              Continue to Business Details
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
