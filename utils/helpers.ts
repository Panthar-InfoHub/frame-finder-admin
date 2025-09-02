export const API_VERSION = `/api/v1`
export const API_URL = `${process.env.SERVER_URL}${API_VERSION}`
export const ADMIN_API_URL = `${process.env.SERVER_URL}${API_VERSION}/admin`


export function getAuthHeaders(accessToken?: string) {
  return {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
}

