"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface VendorMiscByIdResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    vendorId: string;
    type: string;
    values: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export async function getVendorMiscById(
  vendorId: string,
  type?: string
): Promise<VendorMiscByIdResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const url = type
      ? `${API_URL}/vendor-misc/${vendorId}?type=${encodeURIComponent(type)}`
      : `${API_URL}/vendor-misc/${vendorId}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vendor misc by ID:", error);
    return {
      success: false,
      message: "Failed to fetch vendor misc",
      data: {
        _id: "",
        vendorId,
        type: type || "",
        values: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}
