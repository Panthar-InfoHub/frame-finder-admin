"use server";

import { getAccessToken, getSession } from "@/actions/session";
import { FrameFormDataType, SunglassFormDataType } from "@/lib/validations";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";

export const createFrameAction = async (data: FrameFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      brand_name: data.brand_name,
      desc: data.desc,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      stock: data.stock,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        price: {
          mrp: variant.price,
          base_price: variant.price,
        },
        images: variant.images,
      })),
    };


    const resp = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
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

export const getFrameById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/products/${id}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch your frame details");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get the frame";
    return {
      success: false,
      message,
    };
  }
};

export const createSunglassAction = async (data: SunglassFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      brand_name: data.brand_name,
      desc: data.desc,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      stock: data.stock,
      is_power: data.is_power,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        lens_color: variant.lens_color,
        price: {
          mrp: variant.price,
          base_price: variant.price,
        },
        images: variant.images,
      })),
    };

    const resp = await fetch(`${API_URL}/sunglass`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

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
export const getSunglassById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/sunglass/${id}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch your sunglass");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get sunglasd details";
    return {
      success: false,
      message,
    };
  }
};
