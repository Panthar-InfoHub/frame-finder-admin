export interface CMSImage {
  _id?: string;
  url: string;
  order: number;
}

export interface CMSValue {
  _id?: string;
  title?: string;
  desc?: string;
  order: number;
  misc?: Record<string, any>;
}

export interface CMSEntry {
  _id: string;
  key: string;
  value?: CMSValue[];
  images?: CMSImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CMSCreatePayload {
  key: string;
  value?: Omit<CMSValue, "_id">[];
  images?: Omit<CMSImage, "_id">[];
}

export interface CMSUpdatePayload {
  value?: CMSValue[];
  images?: CMSImage[];
}

export interface CMSSearchResponse {
  success: boolean;
  message: string;
  data: CMSEntry[];
  pagination: {
    total: number;
    current_page: number;
    total_pages: number;
  };
}

export interface CMSResponse {
  success: boolean;
  message: string;
  data: CMSEntry;
}

// Predefined CMS keys to ensure consistency
export const CMS_KEYS = {
  PRIVACY: "privacy",
  RETURN: "return",
  FAQS: "faqs",
  HOMEPAGE_BANNER: "homepage_banner",
  TERMS: "terms",
  ABOUT_US: "about_us",
  CONTACT_INFO: "contact_info",
  SHIPPING_POLICY: "shipping_policy",
  WARRANTY: "warranty",
  USER_GUIDE: "user_guide",
} as const;

export type CMSKeyType = (typeof CMS_KEYS)[keyof typeof CMS_KEYS];

export const CMS_KEY_OPTIONS = [
  {
    value: CMS_KEYS.HOMEPAGE_BANNER,
    label: "Homepage Banner",
    type: "banner" as const,
    single: false,
  },
  { value: CMS_KEYS.PRIVACY, label: "Privacy Policy", type: "text" as const, single: true },
  { value: CMS_KEYS.RETURN, label: "Return Policy", type: "text" as const, single: true },
  { value: CMS_KEYS.FAQS, label: "FAQs", type: "text" as const, single: false },
  { value: CMS_KEYS.TERMS, label: "Terms & Conditions", type: "text" as const, single: true },
  {
    value: CMS_KEYS.SHIPPING_POLICY,
    label: "Shipping Policy",
    type: "text" as const,
    single: true,
  },
  // { value: CMS_KEYS.ABOUT_US, label: "About Us", type: "text" as const, single: true },
  // {
  //   value: CMS_KEYS.CONTACT_INFO,
  //   label: "Contact Information",
  //   type: "text" as const,
  //   single: true,
  // },
  // { value: CMS_KEYS.WARRANTY, label: "Warranty Information", type: "text" as const, single: true },
  // { value: CMS_KEYS.USER_GUIDE, label: "User Guide", type: "text" as const, single: true },
] as const;

export type CMSFormType = "text" | "banner";

// Helper to get CMS key configuration
export function getCMSKeyConfig(key: string) {
  return CMS_KEY_OPTIONS.find((opt) => opt.value === key);
}
