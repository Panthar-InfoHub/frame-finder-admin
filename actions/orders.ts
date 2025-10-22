"use server";

import { getAccessToken } from "@/actions/session";
import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { OrderSearchParams, UpdateOrderData } from "@/types/order";
import { revalidatePath } from "next/cache";

export async function searchOrders(params: OrderSearchParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.vendorId) searchParams.append("vendorId", params.vendorId);
  if (params.status) searchParams.append("status", params.status);
  if (params.userId) searchParams.append("userId", params.userId);
  if (params.startDate) searchParams.append("startDate", params.startDate);
  if (params.endDate) searchParams.append("endDate", params.endDate);
  if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());

  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/order/search?${searchParams.toString()}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: "Failed to fetch orders",
      data: {
        orders: [],
        pagination: {
          page: params?.page ? parseInt(params.page) : 1,
          limit: params?.limit ? parseInt(params.limit) : 30,
          totalCount: 0,
          pages: 0,
        },
      },
    };
  }
}

export async function getOrderById(id: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/order/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: "Failed to fetch order details",
      data: null,
    };
  }
}

export async function updateOrderStatus(id: string, updateData: UpdateOrderData) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/order/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    revalidatePath("/dashboard/orders");

    return {
      success: true,
      message: "Order updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      message: "Failed to update order",
      data: null,
    };
  }
}
