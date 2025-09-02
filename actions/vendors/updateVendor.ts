"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";
import { Vendor } from "@/types/vendor";
import { revalidatePath } from "next/cache";

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

export interface UpdateVendorResponse {
  success: boolean;
  message: string;
}

export async function updateVendor(id: string, updateData: UpdateVendorData): Promise<UpdateVendorResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);

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
    revalidatePath(`/admin/vendors/${id}`);

    return {
      success: true,
      message: "Vendor updated successfully",
    };
  } catch (error) {
    console.error("Error updating vendor:", error);
    return {
      success: false,
      message: "Failed to update vendor",
    };
  }
}
