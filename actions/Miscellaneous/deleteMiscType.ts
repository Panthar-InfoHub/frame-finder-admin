"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface DeleteMiscResponse {
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

export async function deleteMiscType(id: string): Promise<DeleteMiscResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/misc/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting misc type:", error);
    return {
      success: false,
      message: "Failed to delete misc type",
      data: {
        _id: id,
        type: "",
        values: [],
        createdAt: "",
        updatedAt: "",
      },
    };
  }
}
