"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";

export interface VendorResponse {
  success: boolean;
  message: string;
  data: any[];
  pagination: {
    totalCount: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface VendorQueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

export async function getAllVendors(params: VendorQueryParams = {}): Promise<VendorResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);

  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);
    const response = await fetch(`${API_URL}/vendor/all?${searchParams.toString()}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log("vendors api called")
    return data;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch vendors",
      data: [],
      pagination: {
        totalCount: 0,
        totalPages: 0,
        page: params?.page ? parseInt(params.page) : 1,
        limit: params?.limit ? parseInt(params.limit) : 10,
      },
    };
  }
}
