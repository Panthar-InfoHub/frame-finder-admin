"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface AddVendorMiscRequest {
  type: string;
  values: string[];
}

export interface VendorMiscResponse {
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

export async function addVendorMiscValues(
  vendorId: string,
  request: AddVendorMiscRequest
): Promise<VendorMiscResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor-misc/${vendorId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding vendor misc values:", error);
    return {
      success: false,
      message: "Failed to add vendor misc values",
      data: {
        _id: "",
        vendorId,
        type: request.type,
        values: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}
