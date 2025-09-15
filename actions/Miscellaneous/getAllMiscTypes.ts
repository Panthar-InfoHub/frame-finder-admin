"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export async function getAllMiscTypes() {
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
   
    return {
      success: false,
      message: "Failed to fetch all misc types",
      data: null,
    };
  }
}
