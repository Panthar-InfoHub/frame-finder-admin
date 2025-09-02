// Create Vendor
export interface VendorAddress {
  address_line_1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface VendorRegisterData {
  business_name: string;
  business_owner: string;
  address: VendorAddress;
  email: string;
  phone: string;
  password: string;
  gst_number: string;
  logo?: string;
  banner?: string;
}

export interface Vendor extends VendorRegisterData {
  _id: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
