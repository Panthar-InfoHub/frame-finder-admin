"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/actions/auth/session";

import { FormServerActionResponse, VendorRegisterData } from "@/types";
import { API_URL, getAuthHeaders } from "@/utils/helpers";

export async function registerVendor(
  prevState: FormServerActionResponse,
  formData: FormData
): Promise<FormServerActionResponse> {
  try {
    // Extract form data
    const vendorData = {
      business_name: formData.get("business_name") as string,
      business_owner: formData.get("business_owner") as string,
      address_line_1: formData.get("address_line_1") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      gst_number: formData.get("gst_number") as string,
      logo: formData.get("logo") as File,
      banner: formData.get("banner") as File,
    };

    // Basic validation
    const errors: Record<string, string> = {};

    if (!vendorData.business_name?.trim()) {
      errors.business_name = "Business name is required";
    }


    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Prepare data for API call
    const apiData: VendorRegisterData = {
      business_name: vendorData.business_name,
      business_owner: vendorData.business_owner,
      address: {
        address_line_1: vendorData.address_line_1,
        city: vendorData.city,
        state: vendorData.state,
        pincode: vendorData.pincode,
      },
      email: vendorData.email,
      phone: vendorData.phone,
      password: vendorData.password,
      gst_number: vendorData.gst_number,
      logo: vendorData.logo?.name,
      banner: vendorData.banner?.name,
    };

    // Make API call
    const token = await getAccessToken();
    const headers = await getAuthHeaders(token);

    const response = await fetch(`${API_URL}/vendor`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to register vendor",
        errors: result.errors || {},
      };
    }

    // Revalidate vendors list
    revalidatePath("/admin/vendors");

    return {
      success: true,
      message: "Vendor registration successful! Welcome to our platform.",
      errors: {},
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
      errors: {},
    };
  }
}
