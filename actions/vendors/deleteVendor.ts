"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../auth/session";
import { Vendor } from "@/types/vendor";
import { revalidatePath } from "next/cache";

export interface DeleteVendorResponse {
  success: boolean;
  message: string;
}

export async function deleteVendor(id: string): Promise<DeleteVendorResponse> {
  try {
    const accessToken = await getAccessToken();
    const headers = getAuthHeaders(accessToken);
    console.log("deleteinf vendor");

    const response = await fetch(`${API_URL}/vendor/${id}`, {
      method: "DELETE",
      headers,
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    revalidatePath(`/admin/vendors/${id}`);

    return {
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return {
      success: false,
      message: "Failed to delete vendor",
    };
  }
}
