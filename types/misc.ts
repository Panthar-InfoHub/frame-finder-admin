// Miscellaneous Model Types
export interface Miscellaneous {
  _id: string;
  type: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

// Vendor Misc Model Types
export interface VendorMisc {
  _id: string;
  vendorId: string;
  type: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types for API calls
export interface MiscRequest {
  type: string;
  values: string[];
}

export interface RemoveMiscRequest {
  type: string;
  value: string;
}

export interface MiscResponse {
  success: boolean;
  message?: string;
  data: Miscellaneous;
}

export interface AllMiscResponse {
  success: boolean;
  data: Miscellaneous[];
}

export interface VendorMiscRequest {
  type: string;
  values: string[];
}

export interface RemoveVendorMiscRequest {
  type: string;
  value: string;
}

export interface VendorMiscResponse {
  success: boolean;
  message?: string;
  data: VendorMisc;
}
