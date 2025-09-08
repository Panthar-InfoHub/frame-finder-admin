"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface MiscValuesByTypeResponse {
  success: boolean;
  data: {
    _id: string;
    type: string;
    values: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export async function getMiscValuesByType(type: string): Promise<MiscValuesByTypeResponse> {
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
    console.error("Error fetching misc values by type:", error);
    return {
      success: false,
      data: {
        _id: "",
        type,
        values: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}
