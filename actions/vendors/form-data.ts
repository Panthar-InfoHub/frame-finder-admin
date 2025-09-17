"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../session";

export const getFrameFormData = async () => {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);
    const response = await fetch(`${API_URL}/data/frame-data`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data?.success) {
      throw new Error("Failed to fetch frame form data");
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch frame form data",
      data: null,
    };
  }
};
