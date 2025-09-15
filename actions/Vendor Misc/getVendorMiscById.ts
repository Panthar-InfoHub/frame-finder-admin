"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export async function getVendorMiscById(vendorId: string, type: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const url =`${API_URL}/vendor-misc/${vendorId}?type=${type}`

    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    
    const data = await response.json();
    console.log("data",data);
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch vendor misc",
      data: null,
    };
  }
}
