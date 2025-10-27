export interface Coupon {
  _id: string;
  code: string;
  type: "number" | "percentage";
  value: number;
  scope: "vendor" | "global";
  min_order_limit?: number;
  usage_limit?: number;
  user_usage_limit?: number;
  vendorId?:
    | {
        _id: string;
        business_name: string;
        business_owner: string;
      }
    | string;
  is_active: boolean;
  exp_date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateCouponPayload {
  code: string;
  type: "number" | "percentage";
  value: number;
  scope: "vendor" | "global";
  min_order_limit?: number;
  usage_limit?: number;
  user_usage_limit?: number;
  vendorId?: string;
  exp_date: string;
}

export interface UpdateCouponPayload {
  code?: string;
  type?: "number" | "percentage";
  value?: number;
  scope?: "vendor" | "global";
  min_order_limit?: number;
  usage_limit?: number;
  user_usage_limit?: number;
  vendorId?: string;
  is_active?: boolean;
  exp_date?: string;
}

export interface SearchCouponsParams {
  search?: string;
  page?: number;
  limit?: number;
  vendorId?: string;
}

export interface CouponsResponse {
  coupons: Coupon[];
  pagination: {
    limit: number;
    totalCoupons: number;
    pages: number;
  };
}
