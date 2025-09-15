"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface MiscRequest {
  type: string;
  values: string[];
}

export async function addMiscValues(request: MiscRequest) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/misc/`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to add misc values",
      data: null,
    };
  }
}
