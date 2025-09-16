"use server";

import { getAccessToken, getSession } from "@/actions/session";
import { FrameFormData } from "@/components/products/create-frame-form";
import { SunglassFormData } from "@/components/products/create-sunglasses-form";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";

export const createFrameAction = async (data: FrameFormData) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();
    const { quantity, min_quantity, max_quantity, ...restData } = data;
    const finalData = {
      ...restData,
      stock: {
        current: quantity || 0,
        minimum: min_quantity || 0,
        maximum: max_quantity || 100,
      },
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    console.log("Final Data to be sent:", finalData);
    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create product",
    };
  }
};

export const getAllFrames = async () => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch frames");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Fetch Frames";
    return {
      success: false,
      message,
    };
  }
};

export const createSunglassAction = async (data: SunglassFormData) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();
    const finalData = {
      ...data,
      stock: {
        current: data.quantity || 0,
        minimum: data.min_quantity || 0,
        maximum: data.max_quantity || 100,
      },
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/sunglass`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result.message || "Failed to create sunglass product");
    }

    return { success: true, message: "Product created successfully" };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create product");
  }
};

export const getAllSunglasses = async () => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/sunglass`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch sunglasses");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Fetch Frames";
    return {
      success: false,
      message,
    };
  }
};
