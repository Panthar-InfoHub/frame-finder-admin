"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";
import { Vendor } from "@/types/vendor";

export interface VendorByIdResponse {
  success: boolean;
  message: string;
  data: Vendor;
}

export async function getVendorById(id: string): Promise<VendorByIdResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);
    
    const response = await fetch(`${API_URL}/vendor/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    return {
      success: false,
      message: "Failed to fetch vendor",
      data: {} as Vendor,
    };
  }
}
