"use server";

import { getAccessToken } from "@/actions/session";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";

export async function searchUsers(params: any = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);

  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/user/search?${searchParams.toString()}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await parseApiResponse(response);

    return {
      success: data.success,
      message: data.message,
      data: data.data?.data || [],
      pagination: data.data?.pagination || {
        totalUser: 0,
        totalPages: 0,
        page: params?.page ? parseInt(params.page) : 1,
        limit: params?.limit ? parseInt(params.limit) : 30,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: "Failed to fetch users",
      data: [],
      pagination: {
        totalUser: 0,
        totalPages: 0,
        page: params?.page ? parseInt(params.page) : 1,
        limit: params?.limit ? parseInt(params.limit) : 30,
      },
    };
  }
}
