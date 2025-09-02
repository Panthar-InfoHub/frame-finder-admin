"use server";

import { ADMIN_API_URL } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "./session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${ADMIN_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      console.log("Login failed", data?.message || "Invalid credentials");
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
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function Logout() {
  await destroySession();
  redirect("/login");
}
