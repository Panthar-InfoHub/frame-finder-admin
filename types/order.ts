export interface ShippingAddress {
  address_line_1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface LensPackageDetail {
  package_type?: string;
  package_design?: string;
  package_price?: number;
}

export interface OrderItem {
  productId: string;
  onModel: string;
  variantId?: string;
  vendorId: string;
  productName: string;
  price: number;
  quantity: number;
  prescription?: any;
  lens_package_detail?: LensPackageDetail;
}

export interface Order {
  _id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  paymentAttempts?: string[];
  shipping_address: ShippingAddress;
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking_id?: string;
  total_amount: number;
  tax?: number;
  shipping_cost?: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderSearchParams {
  vendorId?: string;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: string;
  limit?: string;
}

export interface UpdateOrderData {
  order_status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking_id?: string;
  paymentAttemptId?: string;
}
