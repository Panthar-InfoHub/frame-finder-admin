"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";
import { MiscRequest, MiscResponse } from "@/types/misc";

export async function addMiscValues(request: MiscRequest): Promise<MiscResponse> {
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
    console.error("Error adding misc values:", error);
    return {
      success: false,
      message: "Failed to add misc values",
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
