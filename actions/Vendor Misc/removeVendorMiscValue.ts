"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken, getSession } from "../auth/session";

export interface RemoveVendorMiscValueRequest {
  type: string;
  value: string;
}

export async function removeVendorMiscValue(request: RemoveVendorMiscValueRequest) {
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
