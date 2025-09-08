"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface MiscType {
  _id: string;
  type: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AllMiscResponse {
  success: boolean;
  data: MiscType[];
}

export async function getAllMiscTypes(): Promise<AllMiscResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/misc/all`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all misc types:", error);
    return {
      success: false,
      data: [],
    };
  }
}
