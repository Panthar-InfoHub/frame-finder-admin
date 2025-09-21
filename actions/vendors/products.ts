"use server";

import { getAccessToken, getSession } from "@/actions/session";
import {
  AccessoryFormDataType,
  ContactLensFormDataType,
  FrameFormDataType,
  SunglassFormDataType,
} from "@/lib/validations";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";

// ------------------- Frames API Actions -------------------

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

export const updateFrameAction = async (id: string, data: Omit<FrameFormDataType, "stock">) => {
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

    const resp = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update product",
    };
  }
};

export const updateFrameStockAction = async (
  id: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const body = {
      operation,
      quantity,
    };

    const resp = await fetch(`${API_URL}/products/${id}/stock`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Product stock updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
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

export const deleteFrameAction = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
};

// ------------------- Sunglasses API Actions -------------------

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

export const updateSunglassAction = async (
  id: string,
  data: Omit<SunglassFormDataType, "stock">
) => {
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

    const resp = await fetch(`${API_URL}/sunglass/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update product",
    };
  }
};

export const updateSunglassStockAction = async (
  id: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();

    const body = {
      operation,
      quantity,
    };

    const resp = await fetch(`${API_URL}/sunglass/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return {
      success: true,
      message: "Sunglass stock updated successfully",
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
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

export const deleteSunglassAction = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/sunglass/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return {
      success: true,
      message: "Sunglass deleted successfully",
      data: result.data, // contains _id and status = inactive
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete sunglass",
    };
  }
};

// ------------------- Contact Lenses API Actions -------------------

// 1. Create Contact Lens
export const createContactLensAction = async (
  type: "contact_lens" | "contact_lens_color",
  data: ContactLensFormDataType
) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const finalData = {
      ...data,
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/contact-lens/${type}`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Contact lens created successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create contact lens",
    };
  }
};

// 2. Get All Contact Lenses
export const getAllContactLenses = async (
  type: "contact_lens" | "contact_lens_color",
  page = 1,
  limit = 100,
  search = ""
) => {
  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append("search", search);

    const resp = await fetch(`${API_URL}/contact-lens/${type}?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch contact lenses");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch contact lenses",
    };
  }
};

// 3. Get Contact Lens by ID
export const getContactLensById = async (
  type: "contact_lens" | "contact_lens_color",
  id: string
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${type}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch contact lens details");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch contact lens details",
    };
  }
};

// 4. Update Contact Lens (except stock)
export const updateContactLensAction = async (
  type: "contact_lens" | "contact_lens_color",
  id: string,
  data: Partial<ContactLensFormDataType>
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${type}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Contact lens updated successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update contact lens",
    };
  }
};

// 5. Update Contact Lens Stock
export const updateContactLensStockAction = async (
  type: "contact_lens" | "contact_lens_color",
  id: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${type}/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ operation, quantity }),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Contact lens stock updated successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

// 6. Delete Contact Lens (soft delete)
export const deleteContactLensAction = async (
  type: "contact_lens" | "contact_lens_color",
  id: string
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${type}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Contact lens deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete contact lens",
    };
  }
};

// ------------------- Accessories API Actions -------------------

export const createAccessoryAction = async (data: AccessoryFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      brand_name: data.brand_name,
      desc: data.desc,
      material: data.material,
      hsn_code: data.hsn_code,
      stock: data.stock || {
        current: 0,
        minimum: 5,
        maximum: 100,
      },
      vendorId: user?.id,
      rating: data.rating || 0,
      status: data.status || "active",
      images: data.images?.map((url) => ({ url })) || [],
      price: {
        base_price: data.price.base_price,
        mrp: data.price.mrp,
      },
      type: "Accessories",
    };

    const resp = await fetch(`${API_URL}/accessories`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create accessory",
    };
  }
};

export const updateAccessoryAction = async (id: string, data: Partial<AccessoryFormDataType>) => {
  try {
    const token = await getAccessToken();

    const finalData = {
      brand_name: data.brand_name,
      desc: data.desc,
      material: data.material,
      hsn_code: data.hsn_code,
      rating: data.rating,
      status: data.status,
      images: data.images?.map((url) => ({ url })),
      price: data.price,
    };

    const resp = await fetch(`${API_URL}/accessories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update accessory",
    };
  }
};

export const updateAccessoryStock = async (
  id: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();
    const finalData = { operation, quantity };

    const resp = await fetch(`${API_URL}/accessories/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory stock updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

export const getAllAccessories = async (
  query: { page?: number; limit?: number; vendorId?: string; search?: string } = {}
) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const params = new URLSearchParams();
    if (query.page) params.append("page", query.page.toString());
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.vendorId) params.append("vendorId", query.vendorId);
    if (query.search) params.append("search", query.search);

    const resp = await fetch(`${API_URL}/accessories?${params.toString()}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch accessories");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch accessories";
    return {
      success: false,
      message,
    };
  }
};

export const getAccessoryById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/accessories/${id}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch accessory details");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get accessory";
    return {
      success: false,
      message,
    };
  }
};

export const deleteAccessory = async (id: string) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${API_URL}/accessories/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete accessory",
    };
  }
};
