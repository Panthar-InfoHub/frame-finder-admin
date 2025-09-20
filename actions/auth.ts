"use server";

import { API_URL } from "@/utils/helpers";
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
      body: JSON.stringify({ loginId:email, password, type }),
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
