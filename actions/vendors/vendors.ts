"use server";

import { createSession, getAccessToken } from "@/actions/session";

import { VendorRegisterData } from "@/types";
import { API_URL, getAuthHeaders, parseApiResponse } from "@/utils/helpers";
import { revalidatePath } from "next/cache";

export async function registerVendor(formData: FormData) {
  try {
    // Extract form data
    const vendorData = {
      business_name: formData.get("business_name") as string,
      business_owner: formData.get("business_owner") as string,
      address_line_1: formData.get("address_line_1") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      gst_number: formData.get("gst_number") as string,
      logo: formData.get("logo") as File,
      banner: formData.get("banner") as File,
    };

    // Prepare data for API call
    const apiData: VendorRegisterData = {
      business_name: vendorData.business_name,
      business_owner: vendorData.business_owner,
      address: {
        address_line_1: vendorData.address_line_1,
        city: vendorData.city,
        state: vendorData.state,
        pincode: vendorData.pincode,
      },
      email: vendorData.email,
      phone: vendorData.phone,
      password: vendorData.password,
      gst_number: vendorData.gst_number,
      logo: vendorData.logo?.name,
      banner: vendorData.banner?.name,
    };

    // Make API call
    const token = await getAccessToken();
    const headers = await getAuthHeaders(token);

    const response = await fetch(`${API_URL}/vendor`, {
      method: "POST",
      headers,
      body: JSON.stringify(apiData),
    });

    const result = await parseApiResponse(response);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Registration failed");
    }

    // if it has accesstoken then create the sesion
    if (result?.data?.accessToken) {
      await createSession(result.data.accessToken);
    }
    return {
      success: true,
      message: "Vendor registration successful! Welcome to our platform.",
    };
  } catch (error) {
    console.error("Error occurred during vendor registration:", error);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
}

export async function deleteVendor(id: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    revalidatePath(`/admin/vendors/${id}`);

    return {
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete vendor",
    };
  }
}

export interface VendorQueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

export async function getAllVendors(params: VendorQueryParams = {}) {
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

export async function getVendorById(id: string) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    const response = await fetch(`${API_URL}/vendor/${id}`, {
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
    return {
      success: false,
      message: "Failed to fetch vendor",
    };
  }
}

export interface UpdateVendorData {
  business_name?: string;
  business_owner?: string;
  address?: {
    address_line_1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  email?: string;
  phone?: string;
  gst_number?: string;
  logo?: string;
  banner?: string;
}

export async function updateVendor(id: string, updateData: UpdateVendorData) {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

    console.log("updateData", updateData)
    const response = await fetch(`${API_URL}/vendor/${id}`, {
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
    revalidatePath(`/dashboard/setting`);
    revalidatePath(`/admin/vendors/${id}`);

    return {
      success: true,
      message: "Vendor updated successfully",
    };
  } catch (error) {
    console.log("error while updating vendor :", error.response?.data)
    return {
      success: false,
      message: "Failed to update vendor",
    };
  }
}
