"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../session";
import { FrameLensPackageType, SunglassLensPackageType } from "@/lib/validations";

export const createFrameLensPackage = async (data: FrameLensPackageType) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const { quantity, min_quantity, max_quantity, ...restData } = data;
    const finalData = {
      ...restData,
      stock: {
        current: quantity || 0,
        minimum: min_quantity || 0,
        maximum: max_quantity || 100,
      },
    };

    const resp = await fetch(`${API_URL}/lens-package`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalData),
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to create lens package");
    }
    return respData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create lens package";
    return {
      success: false,
      message,
    };
  }
};

export const getAllFrameLensPackages = async () => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/lens-package`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch lens packages");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Fetch Lens Packages";
    return {
      success: false,
      message,
    };
  }
};


export const createSunglassLensPackage = async (data: SunglassLensPackageType) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const { quantity, min_quantity, max_quantity,images,price,lens_color, ...restData } = data;
    const finalData = {
      ...restData,
      stock: {
        current: quantity || 0,
        minimum: min_quantity || 0,
        maximum: max_quantity || 100,
      },
      variants:[
        {
          lens_color,
          price,
          images
        }
      ]
    };

    const resp = await fetch(`${API_URL}/sun-lens-package`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalData),
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to create lens package");
    }
    return respData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create lens package";
    return {
      success: false,
      message,
    };
  }
};

export const getAllSunglassLensPackages = async () => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/sun-lens-package`, {
      method: "GET",
      headers,
    });

    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch sun lens packages");
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to Fetch Sun Lens Packages";
    return {
      success: false,
      message,
    };
  }
};
