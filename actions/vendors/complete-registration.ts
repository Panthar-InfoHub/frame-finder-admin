"use server";

import { createSession } from "@/actions/session";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";
import { VendorCompleteRegistrationType } from "@/lib/validations";

export async function completeVendorRegistration(data: VendorCompleteRegistrationType) {
  try {
    // Prepare API data according to the API structure
    const apiData = {
      phone: data.phone,
      business_name: data.business_name,
      business_owner: data.business_owner,
      email: data.email,
      password: data.password,
      address: data.address,
      gst_number: data.gst_number,
      logo: data.logo,
      banner: data.banner,
      bank_details: data.bank_details,
      categories: data.categories || [],
    };

    const response = await fetch(`${API_URL}/vendor`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(apiData),
    });

    const result = await parseApiResponse(response);
    console.log("Vendor registration response:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration failed");
    }

    // If backend returns access token, create session
    if (result?.data?.accessToken) {
      await createSession(result.data.accessToken);
    }

    return {
      success: true,
      message: result.message || "Vendor registration successful! Welcome to our platform.",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error occurred during vendor registration:", error);
    return {
      success: false,
      message: error.message || "Registration failed. Please try again later.",
    };
  }
}
