"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export async function getMiscValuesByType(type: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/misc/values?type=${encodeURIComponent(type)}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
   
    return {
      success: false,
      message: "Failed to fetch misc values",
      data: null,
    };
  }
}
