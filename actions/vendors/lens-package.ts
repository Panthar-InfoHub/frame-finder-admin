"use server";

import { API_URL, getAuthHeaders } from "@/utils/helpers";
import { getAccessToken } from "../session";
import { FrameLensPackageType, SunglassLensPackageType } from "@/lib/validations";

export const createFrameLensPackage = async (data: FrameLensPackageType) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/lens-package`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
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

export const getAllFrameLensPackages = async ({
  page = 1,
  limit = 100,
  code,
}: {
  page?: number;
  limit?: number;
  code?: string;
} = {}) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (code) params.set("code", code);

 
    const resp = await fetch(`${API_URL}/lens-package?${params.toString()}`, {
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

export const getFrameLensPackageById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/lens-package/${id}`, {
      method: "GET",
      headers,
    });
    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch your Frame Lens Package");
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to get the frame";
    return {
      success: false,
      message,
    };
  }
};

export const updateFrameLensPackage = async (id: string, data: Partial<FrameLensPackageType>) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/lens-package/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to update lens package");
    }
    return respData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update lens package";
    return {
      success: false,
      message,
    };
  }
};

export const deleteFrameLensPackage = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/lens-package/${id}`, {
      method: "DELETE",
      headers,
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to delete lens package");
    }
    return respData;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete lens package";
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

    const resp = await fetch(`${API_URL}/sun-lens-package`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to create sunglass lens package");
    }
    return respData;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create sunglass lens package";
    return {
      success: false,
      message,
    };
  }
};

export const getAllSunglassLensPackages = async ({
  page = 1,
  limit = 100,
  code,
}: {
  page?: number;
  limit?: number;
  code?: string;
} = {}) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (code) params.set("code", code);

    const resp = await fetch(`${API_URL}/sun-lens-package?${params.toString()}`, {
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

export const getSunglassLensPackageById = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);
    const resp = await fetch(`${API_URL}/sun-lens-package/${id}`, {
      method: "GET",
      headers,
    });
    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch your Sunglass Lens Package");
    }
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get the sunglass lens package";
    return {
      success: false,
      message,
    };
  }
};

export const updateSunglassLensPackage = async (
  id: string,
  data: Partial<SunglassLensPackageType>
) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/sun-lens-package/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to update sunglass lens package");
    }
    return respData;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update sunglass lens package";
    return {
      success: false,
      message,
    };
  }
};

export const deleteSunglassLensPackage = async (id: string) => {
  try {
    const token = await getAccessToken();
    const headers = getAuthHeaders(token);

    const resp = await fetch(`${API_URL}/sun-lens-package/${id}`, {
      method: "DELETE",
      headers,
    });
    const respData = await resp.json();

    if (!resp.ok || !respData.success) {
      throw new Error(respData.message || "Failed to delete sunglass lens package");
    }
    return respData;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete sunglass lens package";
    return {
      success: false,
      message,
    };
  }
};
