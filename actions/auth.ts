"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/actions/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const type = formData.get("type") as string;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId: email, password, type }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Invalid credentials",
      };
    }

    // store accessToken in cookie if backend doesn’t
    if (data.data?.accessToken) {
      await createSession(data.data.accessToken);
    }
    return { success: true, message: data.message || "Login successful" };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function IsUserNumberVerified(phone: string) {
  try {
    const response = await fetch(`${API_URL}/auth/verify-user`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify phone number");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
    };
  }
}

export async function VerifyOTP(phone: string) {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify OTP");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }
}

export async function Logout() {
  await destroySession();
  redirect("/login");
}
