"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface RemoveMiscValueRequest {
  type: string;
  value: string;
}

export interface MiscResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    type: string;
    values: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export async function removeMiscValue(request: RemoveMiscValueRequest): Promise<MiscResponse> {
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
    console.error("Error removing misc value:", error);
    return {
      success: false,
      message: "Failed to remove misc value",
      data: {
        _id: "",
        type: request.type,
        values: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}
