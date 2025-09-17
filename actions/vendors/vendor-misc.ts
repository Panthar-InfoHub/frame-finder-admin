"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken, getSession } from "../session";
import { revalidatePath } from "next/cache";

export interface AddVendorMiscRequest {
  type: string;
  values: string[];
}

export async function addVendorMiscValues(request: AddVendorMiscRequest) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);
    const { user } = await getSession();

    const response = await fetch(`${API_URL}/vendor-misc/${user?.id}`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
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

export async function removeVendorMiscValue(request: { type: string; value: string }) {
  try {
    const accessToken = await getAccessToken();
    const { user } = await getSession();

    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor-misc/${user?.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to remove vendor misc value",
    };
  }
}

export async function getVendorMiscById(vendorId: string, type: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const url = `${API_URL}/vendor-misc/${vendorId}?type=${type}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch vendor misc",
      data: null,
    };
  }
}
