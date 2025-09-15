"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "./session";

export async function addMiscValues(request: { type: string; values: string[] }) {
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

export async function deleteMiscType(id: string) {
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
    return {
      success: false,
      message: "Failed to delete misc type",
    };
  }
}

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

export async function removeMiscValue(request: { type: string; value: string }) {
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
