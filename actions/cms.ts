"use server";

import {
  CMSEntry,
  CMSCreatePayload,
  CMSUpdatePayload,
  CMSSearchResponse,
  CMSResponse,
} from "@/types/cms";
import { getAccessToken } from "./session";
import { API_URL, getAuthHeaders } from "@/utils/helpers";

// Create CMS Entry
export async function createCMSEntry(payload: CMSCreatePayload) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data: CMSResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create CMS entry",
      };
    }

    return {
      success: true,
      message: data.message || "CMS entry created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating CMS entry:", error);
    return {
      success: false,
      message: "An error occurred while creating CMS entry",
    };
  }
}

// Update CMS Entry
export async function updateCMSEntry(id: string, payload: CMSUpdatePayload) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data: CMSResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update CMS entry",
      };
    }

    return {
      success: true,
      message: data.message || "CMS entry updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating CMS entry:", error);
    return {
      success: false,
      message: "An error occurred while updating CMS entry",
    };
  }
}

// Get CMS Entry by Key
export async function getCMSEntryByKey(key: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/key?key=${key}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data: CMSResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch CMS entry",
      };
    }

    return {
      success: true,
      message: data.message || "CMS entry fetched successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching CMS entry:", error);
    return {
      success: false,
      message: "An error occurred while fetching CMS entry",
    };
  }
}

// Search CMS Entries
export async function searchCMSEntries(page: number = 1, limit: number = 30) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/search?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data: CMSSearchResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch CMS entries",
      };
    }

    return {
      success: true,
      message: data.message || "CMS entries fetched successfully",
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("Error fetching CMS entries:", error);
    return {
      success: false,
      message: "An error occurred while fetching CMS entries",
    };
  }
}

// Remove Sub CMS Value
export async function removeSubCMSValue(id: string, subId: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/remove-sub-cms/${id}?sub_id=${subId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data: CMSResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove sub CMS value",
      };
    }

    return {
      success: true,
      message: data.message || "Sub CMS value removed successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error removing sub CMS value:", error);
    return {
      success: false,
      message: "An error occurred while removing sub CMS value",
    };
  }
}

// Delete CMS Entry
export async function deleteCMSEntry(id: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/cms/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data: CMSResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete CMS entry",
      };
    }

    return {
      success: true,
      message: data.message || "CMS entry deleted successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error deleting CMS entry:", error);
    return {
      success: false,
      message: "An error occurred while deleting CMS entry",
    };
  }
}
