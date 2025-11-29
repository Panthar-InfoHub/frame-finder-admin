"use server";

import {
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
  SearchCouponsParams,
  CouponsResponse,
} from "@/types/coupon";
import { getAccessToken } from "./session";
import { API_URL, getAuthHeaders } from "@/utils/helpers";

// Create Coupon
export async function createCoupon(payload: CreateCouponPayload) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/coupon/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create coupon",
      };
    }

    return {
      success: true,
      message: data.message || "Coupon created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating coupon:", error);
    return {
      success: false,
      message: "An error occurred while creating coupon",
    };
  }
}

// Update Coupon
export async function updateCoupon(id: string, payload: UpdateCouponPayload) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/coupon/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update coupon",
      };
    }

    return {
      success: true,
      message: data.message || "Coupon updated successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating coupon:", error);
    return {
      success: false,
      message: "An error occurred while updating coupon",
    };
  }
}

// Search Coupons
export async function searchCoupons(params: SearchCouponsParams) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.vendorId) searchParams.append("vendorId", params.vendorId);

    const response = await fetch(`${API_URL}/coupon/search?${searchParams.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch coupons",
      };
    }

    return {
      success: true,
      message: data.message || "Coupons fetched successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return {
      success: false,
      message: "An error occurred while fetching coupons",
    };
  }
}

// Get Coupon by ID
export async function getCouponById(id: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/coupon/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch coupon",
      };
    }

    return {
      success: true,
      message: data.message || "Coupon fetched successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return {
      success: false,
      message: "An error occurred while fetching coupon",
    };
  }
}

// Delete Coupon
export async function deleteCoupon(id: string) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    const response = await fetch(`${API_URL}/coupon/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete coupon",
      };
    }

    return {
      success: true,
      message: data.message || "Coupon deleted successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return {
      success: false,
      message: "An error occurred while deleting coupon",
    };
  }
}
