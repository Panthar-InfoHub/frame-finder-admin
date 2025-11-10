"use server";

import { getAccessToken, getSession } from "@/actions/session";
import {
  AccessoryFormDataType,
  ContactLensFormDataType,
  ColorContactLensFormDataType,
  FrameFormDataType,
  ReaderFormDataType,
  SunglassFormDataType,
} from "@/lib/validations";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";
import { revalidatePath } from "next/cache";

// ------------------- Frames API Actions -------------------

export const createFrameAction = async (data: FrameFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      productCode: data.productCode,
      brand_name: data.brand_name,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        price: {
          base_price: variant.price.base_price,
          mrp: variant.price.mrp,
          shipping_price: variant.price.shipping_price,
          total_price: variant.price.total_price,
        },
        stock: {
          current: variant.stock.current,
          minimum: variant.stock.minimum,
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create product",
    };
  }
};

export const updateFrameAction = async (id: string, data: FrameFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      productCode: data.productCode,
      brand_name: data.brand_name,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        price: {
          base_price: variant.price.base_price,
          mrp: variant.price.mrp,
          shipping_price: variant.price.shipping_price,
          total_price: variant.price.total_price,
        },
        stock: {
          current: variant.stock.current,
          minimum: variant.stock.minimum,
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
  operation: string,
  quantity: number,
  variantId: string
) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const body = {
      operation,
      quantity,
      variantId,
    };

    const resp = await fetch(`${API_URL}/products/${id}/stock`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/frames");
    revalidatePath(`/dashboard/products/frames/${id}`);
    revalidatePath(`/dashboard/products/frames/${id}/edit`);

    return { success: true, message: "Product stock updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

export const getAllFrames = async ({
  page = 1,
  limit = 100,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.set("search", search);

    const resp = await fetch(`${API_URL}/products?${params.toString()}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();
    if (!resp.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to fetch frames");
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
      throw new Error(data.error?.message || "Failed to fetch your frame details");
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
      productCode: data.productCode,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      is_Power: data.is_Power,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        lens_color: variant.lens_color,
        price: variant.price,
        stock: variant.stock,
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
      productCode: data.productCode,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      is_Power: data.is_Power,
      vendorId: user?.id,
      rating: data.rating || 4.5,
      status: data.status || "active",
      variants: data.variants.map((variant) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        lens_color: variant.lens_color,
        price: variant.price,
        stock: variant.stock,
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
  operation: string,
  quantity: number,
  variantId: string
) => {
  try {
    const token = await getAccessToken();

    const body = {
      operation,
      quantity,
      variantId,
    };

    const resp = await fetch(`${API_URL}/sunglass/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(body),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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

export const getAllSunglasses = async ({
  page = 1,
  limit = 100,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.set("search", search);

    const resp = await fetch(`${API_URL}/sunglass?${params.toString()}`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to fetch sunglasses");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Fetch Sunglasses";
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
      throw new Error(data.error?.message || "Failed to fetch your sunglass");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get sunglass details";
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
export const createContactLensAction = async (data: ContactLensFormDataType) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const finalData = {
      ...data,
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/contact-lens`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/contact-lens");

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
  page: number = 1,
  limit: number = 100,
  search?: string
) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      vendorId: user?.id || "",
      ...(search && { search }),
    });

    const resp = await fetch(`${API_URL}/contact-lens?${queryParams.toString()}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch contact lenses");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch contact lenses",
    };
  }
};

// 3. Get Contact Lens by ID
export const getContactLensById = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch contact lens details");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch contact lens details",
    };
  }
};

// 4. Update Contact Lens (except stock)
export const updateContactLensAction = async (id: string, data: ContactLensFormDataType) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
  id: string,
  variantId: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ operation, quantity, variantId }),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
export const deleteContactLensAction = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/contact-lens/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/contact-lens");

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
      productCode: data.productCode,
      brand_name: data.brand_name,
      material: data.material || [],
      hsn_code: data.hsn_code,
      sizes: data.sizes || [],
      vendorId: user?.id,
      rating: data.rating || 0,
      status: data.status || "active",
      type: "Accessories",
      images: data.images || [],
      mfg_date: data.mfg_date,
      exp: data.exp,
      origin_country: data.origin_country,
      price: {
        base_price: data.price.base_price,
        mrp: data.price.mrp,
        total_price: data.price.total_price || data.price.base_price,
      },
      stock: {
        current: data.stock?.current || 0,
        minimum: data.stock?.minimum || 5,
      },
    };

    const resp = await fetch(`${API_URL}/accessories`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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

    const finalData: any = {};

    if (data.brand_name) finalData.brand_name = data.brand_name;
    if (data.material) finalData.material = data.material;
    if (data.origin_country) finalData.origin_country = data.origin_country;
    if (data.sizes) finalData.sizes = data.sizes;
    if (data.price)
      finalData.price = {
        base_price: data.price.base_price,
        mrp: data.price.mrp,
        total_price: data.price.total_price || data.price.base_price,
      };
    if (data.images) finalData.images = data.images;

    const resp = await fetch(`${API_URL}/accessories/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });
    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory stock updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

export const getAllAccessories = async ({
  page = 1,
  limit = 100,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.set("search", search);

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
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Accessory deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete accessory",
    };
  }
};

// ------------------- Color Contact Lens API Actions -------------------

// 1. Create Color Contact Lens
export const createColorContactLensAction = async (data: any) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const finalData = {
      ...data,
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/color-contact-lens`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/contact-lens-color");

    return { success: true, message: "Color contact lens created successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create color contact lens",
    };
  }
};

// 2. Get All Color Contact Lenses
export const getAllColorContactLenses = async (
  page: number = 1,
  limit: number = 100,
  search?: string
) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      vendorId: user?.id || "",
      ...(search && { search }),
    });

    const resp = await fetch(`${API_URL}/color-contact-lens?${queryParams.toString()}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch color contact lenses");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch color contact lenses",
    };
  }
};

// 3. Get Color Contact Lens by ID
export const getColorContactLensById = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/color-contact-lens/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch color contact lens details");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch color contact lens details",
    };
  }
};

// 4. Update Color Contact Lens (except stock and variant)
export const updateColorContactLensAction = async (id: string, data: any) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/color-contact-lens/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Color contact lens updated successfully", data: result.data };
  } catch (error) {
    console.error("❌ Update Action Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update color contact lens",
    };
  }
};

// 5. Update Color Contact Lens Variant Details (except stock)
export const updateColorContactLensVariantAction = async (
  id: string,
  variantId: string,
  variantData: any
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/color-contact-lens/${id}/variant`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ variantId, ...variantData }),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Variant updated successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update variant",
    };
  }
};

// 6. Update Color Contact Lens Stock
export const updateColorContactLensStockAction = async (
  id: string,
  variantId: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/color-contact-lens/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ operation, quantity, variantId }),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Stock updated successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

// 7. Delete Color Contact Lens (soft delete)
export const deleteColorContactLensAction = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/color-contact-lens/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/contact-lens-color");

    return { success: true, message: "Color contact lens deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete color contact lens",
    };
  }
};

// ------------------- Lens Solution API Actions -------------------

export const createLensSolutionAction = async (data: any) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const finalData = {
      ...data,
      vendorId: user?.id,
    };

    const resp = await fetch(`${API_URL}/lens-solution`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/lens-solution");

    return { success: true, message: "Lens solution created successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create lens solution",
    };
  }
};

export const updateLensSolutionAction = async (id: string, data: any) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/lens-solution/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Lens solution updated successfully", data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update lens solution",
    };
  }
};

export const updateLensSolutionStockAction = async (
  id: string,
  variantId: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/lens-solution/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ operation, quantity, variantId }),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/lens-solution");
    revalidatePath(`/dashboard/products/lens-solution/${id}`);

    return {
      success: true,
      message: "Lens solution stock updated successfully",
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
};

export const getAllLensSolutions = async (
  page: number = 1,
  limit: number = 100,
  search?: string
) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      vendorId: user?.id || "",
      ...(search && { search }),
    });

    const resp = await fetch(`${API_URL}/lens-solution?${queryParams.toString()}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch lens solutions");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch lens solutions",
    };
  }
};

export const getLensSolutionById = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/lens-solution/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || "Failed to fetch lens solution details");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch lens solution details",
    };
  }
};

export const deleteLensSolutionAction = async (id: string) => {
  try {
    const token = await getAccessToken();

    const resp = await fetch(`${API_URL}/lens-solution/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);

    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    revalidatePath("/dashboard/products/lens-solution");

    return { success: true, message: "Lens solution deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete lens solution",
    };
  }
};

// ------------------- Reader Glasses API Actions -------------------

export const createReaderAction = async (data: any) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      productCode: data.productCode,
      brand_name: data.brand_name,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      vendorId: user?.id,
      rating: data.rating || 0,
      status: data.status || "active",
      variants: data.variants.map((variant: any) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        lens_color: variant.lens_color,
        power: variant.power,
        price: {
          base_price: variant.price.base_price,
          mrp: variant.price.mrp,
          shipping_price: variant.price.shipping_price,
          total_price: variant.price.total_price,
        },
        stock: {
          current: variant.stock.current,
          minimum: variant.stock.minimum,
        },
        images: variant.images,
      })),
    };

    const resp = await fetch(`${API_URL}/reader`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Reader glass created successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create reader glass",
    };
  }
};

export const updateReaderAction = async (id: string, data: any) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    // Transform the data to match the expected API structure
    const finalData = {
      productCode: data.productCode,
      brand_name: data.brand_name,
      material: data.material,
      shape: data.shape,
      style: data.style,
      hsn_code: data.hsn_code,
      sizes: data.sizes,
      gender: data.gender,
      dimension: data.dimension,
      vendorId: user?.id,
      rating: data.rating || 0,
      status: data.status || "active",
      variants: data.variants.map((variant: any) => ({
        frame_color: variant.frame_color,
        temple_color: variant.temple_color,
        lens_color: variant.lens_color,
        power: variant.power,
        price: {
          base_price: variant.price.base_price,
          mrp: variant.price.mrp,
          shipping_price: variant.price.shipping_price,
          total_price: variant.price.total_price,
        },
        stock: {
          current: variant.stock.current,
          minimum: variant.stock.minimum,
        },
        images: variant.images,
      })),
    };

    const resp = await fetch(`${API_URL}/reader/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(finalData),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    revalidatePath(`/dashboard/products/readers/${id}`);
    return { success: true, message: "Reader glass updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update reader glass",
    };
  }
};

export const updateReaderStock = async (
  id: string,
  variantId: string,
  operation: "increase" | "decrease",
  quantity: number
) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${API_URL}/reader/${id}/stock`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        operation,
        quantity,
        variantId,
      }),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }

    return { success: true, message: "Reader glass stock updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update reader glass stock",
    };
  }
};

export const getAllReaders = async (page: number = 1, limit: number = 100, search?: string) => {
  try {
    const { user } = await getSession();
    const token = await getAccessToken();

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      vendorId: user?.id || "",
      ...(search && { search }),
    });

    const resp = await fetch(`${API_URL}/reader?${queryParams.toString()}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return {
      success: true,
      data: result.data?.result || {
        products: [],
        pagination: { totalProducts: 0, totalPages: 0 },
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch reader glasses",
      data: { products: [], pagination: { totalProducts: 0, totalPages: 0 } },
    };
  }
};

export const getReaderById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${API_URL}/reader/${id}`, {
      headers: getAuthHeaders(token),
      cache: "no-store",
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch reader glass",
      data: null,
    };
  }
};

export const deleteReader = async (id: string) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${API_URL}/reader/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    const result = await parseApiResponse(resp);
    if (!resp.ok || !result.success) {
      throw new Error(result?.error?.message || `HTTP ${resp.status}: ${resp.statusText}`);
    }
    return { success: true, message: "Reader glass deleted successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete reader glass",
    };
  }
};
