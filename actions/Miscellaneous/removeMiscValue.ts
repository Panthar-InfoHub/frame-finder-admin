"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface RemoveMiscValueRequest {
  type: string;
  value: string;
}

export async function removeMiscValue(request: RemoveMiscValueRequest) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/misc/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
   
    return {
      success: false,
      message: "Failed to remove misc value",
    };
  }
}
