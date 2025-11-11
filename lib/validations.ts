import { z } from "zod";

// Variant schema for frame products
export type FrameVariantType = z.infer<typeof FrameVariantSchema>;
export const FrameVariantSchema = z.object({
  frame_color: z.string().min(1, "Frame color is required"),
  temple_color: z.string().min(1, "Temple color is required"),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      shipping_price: z.object({
        custom: z.boolean().default(false),
        value: z.coerce.number().min(0).default(100),
      }),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // If custom shipping is false, discounted price must be at least 100 rupees less than MRP
        if (!data.shipping_price.custom) {
          return data.mrp - data.base_price >= 100;
        }
        return true;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP when using default shipping",
        path: ["base_price"],
      }
    ),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
  }),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type FrameFormDataType = z.infer<typeof FrameSchema>;
export const FrameSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  is_power: z.boolean().optional().default(false),
  dimension: z.object({
    lens_width: z.coerce.number().positive("Lens width must be positive"),
    bridge_width: z.coerce.number().positive("Bridge width must be positive"),
    temple_length: z.coerce.number().positive("Temple length must be positive"),
    lens_height: z.coerce.number().positive("Lens height must be positive"),
  }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  variants: z.array(FrameVariantSchema).min(1, "At least one variant is required"),
});

// Variant schema for sunglasses products
export type SunglassVariantType = z.infer<typeof SunglassVariantSchema>;
export const SunglassVariantSchema = z.object({
  frame_color: z.string().min(1, "Frame color is required"),
  temple_color: z.string().min(1, "Temple color is required"),
  lens_color: z.string().min(1, "Lens color is required"),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      shipping_price: z.object({
        custom: z.boolean().default(false),
        value: z.coerce.number().min(0).default(100),
      }),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // If custom shipping is false, discounted price must be at least 100 rupees less than MRP
        if (!data.shipping_price.custom) {
          return data.mrp - data.base_price >= 100;
        }
        return true;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP when using default shipping",
        path: ["base_price"],
      }
    ),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
  }),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type SunglassFormDataType = z.infer<typeof SunglassSchema>;
export const SunglassSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  dimension: z.object({
    lens_width: z.coerce.number().positive("Lens width must be positive"),
    bridge_width: z.coerce.number().positive("Bridge width must be positive"),
    temple_length: z.coerce.number().positive("Temple length must be positive"),
    lens_height: z.coerce.number().positive("Lens height must be positive"),
  }),
  is_Power: z.boolean("Lens Power must be boolean"),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  variants: z.array(SunglassVariantSchema).min(1, "At least one variant is required"),
});

// Contact Lens schemas are defined below (after Accessory and Reader schemas)

// Variant schema for accessory products
export type AccessoryFormDataType = z.infer<typeof AccessorySchema>;

export const AccessorySchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  material: z.array(z.string()).optional().default([]),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z
    .array(z.enum(["S", "M", "L", "XL"]))
    .optional()
    .default([]),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive", "pending"]).optional().default("active"),
  type: z.string().optional().default("Accessories"),
  images: z
    .array(z.object({ url: z.string() }))
    .optional()
    .default([]),
  mfg_date: z.string().optional(),
  exp: z.string().optional(),
  origin_country: z.string().optional(),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      total_price: z.coerce.number().positive("Total price must be positive").optional(),
    })
    .refine(
      (data) => {
        // Discounted price must be at least 100 rupees less than MRP
        return data.mrp - data.base_price >= 100;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP",
        path: ["base_price"],
      }
    ),
  stock: z
    .object({
      current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
      minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
    })
    .optional(),
});

// Variant schema for reader glasses
export type ReaderVariantType = z.infer<typeof ReaderVariantSchema>;
export const ReaderVariantSchema = z.object({
  frame_color: z.string().min(1, "Frame color is required"),
  temple_color: z.string().min(1, "Temple color is required"),
  lens_color: z.string().min(1, "Lens color is required"),
  power: z.array(z.coerce.number().min(-10).max(10)).min(1, "At least one power value is required"),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      shipping_price: z.object({
        custom: z.boolean().default(false),
        value: z.coerce.number().min(0).default(100),
      }),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // If custom shipping is false, discounted price must be at least 100 rupees less than MRP
        if (!data.shipping_price.custom) {
          return data.mrp - data.base_price >= 100;
        }
        return true;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP when using default shipping",
        path: ["base_price"],
      }
    ),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
  }),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type ReaderFormDataType = z.infer<typeof ReaderSchema>;
export const ReaderSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  dimension: z.object({
    lens_width: z.coerce.number().positive("Lens width must be positive"),
    bridge_width: z.coerce.number().positive("Bridge width must be positive"),
    temple_length: z.coerce.number().positive("Temple length must be positive"),
    lens_height: z.coerce.number().positive("Lens height must be positive"),
  }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  variants: z.array(ReaderVariantSchema).min(1, "At least one variant is required"),
});

// Contact Lens Variant Schema
export type ContactLensVariantType = z.infer<typeof ContactLensVariantSchema>;
export const ContactLensVariantSchema = z.object({
  disposability: z.enum(["daily", "monthly", "quarterly", "yearly"], {
    message: "Please select a valid disposability option",
  }),
  mfg_date: z.coerce.date(),
  exp_date: z.coerce.date(),
  hsn_code: z.string().min(1, "HSN code is required"),
  pieces_per_box: z.coerce.number().min(1, "Pieces per box must be at least 1"),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      shipping_price: z.object({
        custom: z.boolean().default(false),
        value: z.coerce.number().min(0).default(0),
      }),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // Discounted price must be at least 100 rupees less than MRP
        return data.mrp - data.base_price >= 100;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP",
        path: ["base_price"],
      }
    ),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").default(5),
  }),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
  power_range: z.object({
    spherical: z.object({
      min: z.coerce.number().min(-20).max(20),
      max: z.coerce.number().min(-20).max(20),
    }),
    cylindrical: z
      .object({
        min: z.coerce.number().min(-10).max(0).optional().default(0),
        max: z.coerce.number().min(-10).max(0).optional().default(0),
      })
      .optional(),
    addition: z
      .object({
        min: z.coerce.number().min(0).max(5).optional().default(0),
        max: z.coerce.number().min(0).max(5).optional().default(0),
      })
      .optional(),
  }),
});

// Contact Lens Schema
export type ContactLensFormDataType = z.infer<typeof ContactLensSchema>;
export const ContactLensSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  contact_lens_cover: z.boolean().optional().default(false),
  size: z.array(z.string()).min(1, "Select at least one size"),
  lens_type: z.enum(["non_toric", "toric", "multi_focal"], {
    message: "Please select a lens type",
  }),
  variants: z.array(ContactLensVariantSchema).min(1, "At least one variant is required"),
});

// Color Contact Lens Variant Schema
export type ColorContactLensVariantType = z.infer<typeof ColorContactLensVariantSchema>;
export const ColorContactLensVariantSchema = z.object({
  disposability: z.enum(["daily", "monthly", "quarterly", "yearly"], {
    message: "Please select a valid disposability option",
  }),
  mfg_date: z.coerce.date(),
  exp_date: z.coerce.date(),
  hsn_code: z.string().min(1, "HSN code is required"),
  pieces_per_box: z.coerce.number().min(1, "Pieces per box must be at least 1"),
  color: z.string().min(1, "Color is required"),
  price: z
    .object({
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      mrp: z.coerce.number().positive("MRP must be positive"),
      shipping_price: z.object({
        custom: z.boolean().default(false),
        value: z.coerce.number().min(0).default(100),
      }),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // Discounted price must be at least 100 rupees less than MRP
        return data.mrp - data.base_price >= 100;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP",
        path: ["base_price"],
      }
    ),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").default(5),
  }),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
  power_range: z
    .object({
      spherical: z.object({
        min: z.coerce.number().min(-20).max(20),
        max: z.coerce.number().min(-20).max(20),
      }),
    })
    .optional(),
});

// Color Contact Lens Schema
export type ColorContactLensFormDataType = z.infer<typeof ColorContactLensSchema>;
export const ColorContactLensSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  brand_name: z.string().min(1, "Brand name is required"),
  contact_lens_cover: z.boolean().optional().default(false),
  size: z.array(z.string()).min(1, "Select at least one size"),
  lens_type: z.enum(["zero_power", "power"], {
    message: "Please select a lens type (zero_power or power)",
  }),
  variants: z.array(ColorContactLensVariantSchema).min(1, "At least one variant is required"),
});

// Frame Lens Package Schema - matching new API structure
export type FrameLensPackageType = z.infer<typeof FrameLensPackageSchema>;
export const FrameLensPackageSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  display_name: z.string().optional(),
  brand_name: z.string().optional(),
  index: z.string().min(1, "Index is required"),
  price: z
    .object({
      mrp: z.coerce.number().positive("MRP must be positive"),
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // Discounted price must be at least 100 rupees less than MRP
        return data.mrp - data.base_price >= 100;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP",
        path: ["base_price"],
      }
    ),
  duration: z.coerce.number().positive("Duration must be positive"),
  images: z
    .array(z.object({ url: z.string() }))
    .optional()
    .default([]),
  prescription_type: z.enum(["single_vision", "bi_focal", "multi_focal"], {
    message: "Invalid prescription type",
  }),
  lens_type: z.string().min(1, "Lens type is required"),
});

// Sunglass Lens Package Schema - matching new API structure
export type SunglassLensPackageType = z.infer<typeof SunglassLensPackageSchema>;
export const SunglassLensPackageSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  display_name: z.string().optional(),
  brand_name: z.string().optional(),
  index: z.string().min(1, "Index is required"),
  price: z
    .object({
      mrp: z.coerce.number().positive("MRP must be positive"),
      base_price: z.coerce.number().positive("Discounted price must be positive"),
      total_price: z.coerce.number().positive("Total price must be positive"),
    })
    .refine(
      (data) => {
        // Discounted price must be at least 100 rupees less than MRP
        return data.mrp - data.base_price >= 100;
      },
      {
        message: "Discounted price must be at least ₹100 less than MRP",
        path: ["base_price"],
      }
    ),
  duration: z.coerce.number().positive("Duration must be positive"),
  images: z
    .array(z.object({ url: z.string() }))
    .optional()
    .default([]),
  prescription_type: z.enum(["single_vision", "bi_focal", "multi_focal"], {
    message: "Invalid prescription type",
  }),
  lens_color: z.string().min(1, "Lens color is required"),
});

// Vendor Registration Schema
export type VendorPersonalDetailsType = z.infer<typeof VendorPersonalDetailsSchema>;
export const VendorPersonalDetailsSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  business_owner: z.string().min(1, "Business owner name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type VendorBusinessDetailsType = z.infer<typeof VendorBusinessDetailsSchema>;
export const VendorBusinessDetailsSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  gst_number: z.string().min(1, "GST number is required"),
  address: z.object({
    address_line_1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(6, "Pincode is required"),
  }),
  categories: z.array(z.string()).optional().default([]),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

export type VendorBankDetailsType = z.infer<typeof VendorBankDetailsSchema>;
export const VendorBankDetailsSchema = z.object({
  bank_details: z.object({
    account_holder_name: z.string().min(1, "Account holder name is required"),
    account_number: z.string().min(1, "Account number is required"),
    ifsc_code: z.string().min(1, "IFSC code is required"),
  }),
});

export type VendorCompleteRegistrationType = z.infer<typeof VendorCompleteRegistrationSchema>;
export const VendorCompleteRegistrationSchema = VendorPersonalDetailsSchema.merge(
  VendorBusinessDetailsSchema
).merge(VendorBankDetailsSchema);
