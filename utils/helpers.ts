export const API_VERSION = `/api/v1`;
export const 
API_URL = `${process.env.SERVER_URL}${API_VERSION}`;
export const ADMIN_API_URL = `${process.env.SERVER_URL}${API_VERSION}/admin`;

export function getAuthHeaders(accessToken?: string) {
  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
}

export const parseApiResponse = async (response: Response) => {
  let result: any;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    result = { success: false, html: await response.text() };
  }

  return result;
};

export function normalizeValue(key: string, value: string, stringKeys: string[] = []): any {
  // If key is in the "force string" list → return raw
  if (stringKeys.includes(key)) return value;

  // 1. Try JSON.parse safely
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    // not JSON
  }

  // 2. Try number conversion
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return Number(value);
  }

  // 3. Fallback to string
  return value;
}

export function normalizeObject(
  input: Record<string, any> | FormData,
  stringKeys: string[] = []
): Record<string, any> {
  // If FormData → convert to object
  const obj = input instanceof FormData ? Object.fromEntries(input.entries()) : input;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, normalizeValue(key, String(value), stringKeys)])
  );
}
