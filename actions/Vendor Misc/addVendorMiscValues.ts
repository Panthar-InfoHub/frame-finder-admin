"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken, getSession } from "../auth/session";
import { revalidatePath } from "next/cache";

export interface AddVendorMiscRequest {
  type: string;
  values: string[];
}

export async function addVendorMiscValues(request: AddVendorMiscRequest) {
  try {
    const accessToken = await getAccessToken();
    const { user } = await getSession();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor-misc/${user?.id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add vendor misc values");
    }
    revalidatePath("/dashboard/products/add-product");
    return { success: true, message: "Vendor misc values added successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add vendor misc values",
    };
  }
}
