"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface RemoveVendorMiscValueRequest {
  type: string;
  value: string;
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

export async function removeVendorMiscValue(
  vendorId: string,
  request: RemoveVendorMiscValueRequest
): Promise<VendorMiscResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor-misc/${vendorId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing vendor misc value:", error);
    return {
      success: false,
      message: "Failed to remove vendor misc value",
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
