// app/(auth)/login/page.tsx  (Next.js App Router, client component)
"use client";

import React, { useEffect, useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-config";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput, PhoneValue } from "@/components/ui/custom/phone-input";
import { IsUserNumberVerified } from "@/actions/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [phone, setPhone] = useState<PhoneValue>({
    e164: "",
    national: "",
    country: "",
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [step, setStep] = useState<"enterPhone" | "enterOtp">("enterPhone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize reCAPTCHA once
    if (!recaptchaRef.current && typeof window !== "undefined") {
      recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
        size: "invisible", // or "normal"
        callback: (response) => {
          // optionally handle recaptcha solved
        },
        "expired-callback": () => {
          // recaptcha expired — you may need to reset
        },
      });
      recaptchaRef.current.render();
    }
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      if (!recaptchaRef.current) {
        throw new Error("reCAPTCHA not initialized");
      }

      const isUserAlreadyVerified = await IsUserNumberVerified(phone.national);
      console.log("isUserAlreadyVerified", isUserAlreadyVerified);
      if (isUserAlreadyVerified.success) {
        toast.success("Phone number is already registered, continue filling your form.");
        //todo avoid sending otp directly fill form
        return;
      }
      const result = await signInWithPhoneNumber(firebaseAuth, phone.e164, recaptchaRef.current);
      setConfirmationResult(result);
      setStep("enterOtp");
    } catch (err: any) {
      console.error("error in sendOtp:", err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      if (!confirmationResult) {
        throw new Error("No confirmation result");
      }
      const res = await confirmationResult.confirm(otp);
      console.log("User signed in:", res.user);

      // Optionally, send token to backend to create a session cookie
      const idToken = await res.user.getIdToken();
      // e.g. await fetch("/api/sessionLogin", { method: "POST", body: JSON.stringify({ token: idToken }) });

      // Redirect or update UI
      router.push("/dashboard");
    } catch (err: any) {
      console.error("OTP verify error:", err);
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded space-y-4">
      <div id="recaptcha-container" />

      {phone && (
        <div className="mt-4">
          <p>Full (E.164): {phone.e164}</p>
          <p>National: {phone.national}</p>
          <p>Country: {phone.country}</p>
        </div>
      )}
      {step === "enterPhone" && (
        <div className="space-y-4">
          <PhoneInput
            value={phone.e164}
            onChange={setPhone}
            defaultCountry="IN"
            placeholder="Enter phone number"
          />
          <Button onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </div>
      )}
      {step === "enterOtp" && (
        <div>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <Button onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
