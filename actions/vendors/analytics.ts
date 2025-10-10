"use server"
import { getAccessToken } from "../session";
import { API_URL, getAuthHeaders } from "@/utils/helpers";


export async function getVendorProductCount() {
    try {
        const accessToken = await getAccessToken();
        const headers = getAuthHeaders(accessToken);
        const response = await fetch(`${API_URL}/vendor-analytics/product-count`, {
            method: "GET",
            headers,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error while fetching product analytics ==> ", error);
        return {
            success: false,
            message: "Failed to fetch vendors",
            data: [],
        };
    }
}
export async function getVendorSaleCount() {
    try {
        const accessToken = await getAccessToken();
        const headers = getAuthHeaders(accessToken);
        const response = await fetch(`${API_URL}/vendor-analytics/sales-count?period=6month`, {
            method: "GET",
            headers,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error while fetching product analytics ==> ", error);
        return {
            success: false,
            message: "Failed to fetch vendors",
            data: [],
        };
    }
}

export async function getVendorMetrics() {
    try {
        const accessToken = await getAccessToken();
        const headers = getAuthHeaders(accessToken);
        const response = await fetch(`${API_URL}/vendor-analytics/metrics`, {
            method: "GET",
            headers,
        });

        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error("Error while fetching metrics analytics ==> ", error);
        return {
            success: false,
            message: "Failed to fetch vendors",
            data: [],
        };
    }
}