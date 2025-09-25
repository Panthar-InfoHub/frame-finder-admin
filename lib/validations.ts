import { z } from "zod";

// Variant schema for frame products
export type FrameVariantType = z.infer<typeof FrameVariantSchema>;
export const FrameVariantSchema = z.object({
  frame_color: z.array(z.string()).min(1, "Add at least one frame color"),
  temple_color: z.array(z.string()).min(1, "Add at least one temple color"),
  price: z.coerce.number().positive("Price must be positive"),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type FrameFormDataType = z.infer<typeof FrameSchema>;
export const FrameSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  stock: z.object({
    current: z.coerce.number().positive("Current stock must be positive"),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
    maximum: z.coerce.number().positive("Maximum stock must be positive").optional().default(100),
  }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  variants: z.array(FrameVariantSchema).min(1, "At least one variant is required"),
});

// Variant schema for sunglasses products
export type SunglassVariantType = z.infer<typeof SunglassVariantSchema>;
export const SunglassVariantSchema = z.object({
  frame_color: z.array(z.string()).min(1, "Add at least one frame color"),
  temple_color: z.array(z.string()).min(1, "Add at least one temple color"),
  lens_color: z.array(z.string()).min(1, "Add at least one lens color"),
  price: z.coerce.number().positive("Price must be positive"),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type SunglassFormDataType = z.infer<typeof SunglassSchema>;
export const SunglassSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  stock: z.object({
    current: z.coerce.number().positive("Current stock must be positive"),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
    maximum: z.coerce.number().positive("Maximum stock must be positive").optional().default(100),
  }),
  is_power: z.boolean("Lens Power must be boolean"),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  variants: z.array(SunglassVariantSchema).min(1, "At least one variant is required"),
});

// Variant schema for contact lens products
export type ContactLensFormDataType = z.infer<typeof ContactLensFormSchema>;

export const ContactLensFormSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  hsn_code: z.string().min(1, "HSN code is required"),
  stock: z
    .object({
      current: z.number().default(0),
      minimum: z.number().default(5),
      maximum: z.number().default(100),
    })
    .optional(),
  exp_date: z.string().min(1, "Expiry date is required"), // use ISO string
  contact_lens_cover: z.boolean().optional(),
  price: z.object({
    base_price: z.number(),
    mrp: z.number(),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid image URL"),
      })
    )
    .optional(),
  size: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  rating: z.number().min(0).max(5).default(0),
});

// Variant schema for accessory products
export type AccessoryFormDataType = z.infer<typeof AccessorySchema>;

export const AccessorySchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  material: z.array(z.string()).optional().default([]),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  stock: z.object({
    current: z.coerce.number().min(0, "Current stock cannot be negative").default(0),
    minimum: z.coerce.number().min(0, "Minimum stock cannot be negative").optional().default(5),
    maximum: z.coerce.number().positive("Maximum stock must be positive").optional().default(100),
  }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  status: z.enum(["active", "inactive", "pending"]).optional().default("active"),
  images: z
    .array(z.object({ url: z.string().url("Invalid image URL") }))
    .optional()
    .default([]),
  price: z.object({
    base_price: z.coerce.number().positive("Base price must be positive"),
    mrp: z.coerce.number().positive("MRP must be positive"),
  }),
  type: z.string().optional().default("Accessories"),
});

// Variant schema for lens packages
export type FrameLensPackageType = z.infer<typeof FrameLensPackageSchema>;
export const FrameLensPackageSchema = z.object({
  company: z.string().min(1, "Company is required"),
  index: z.coerce.number().positive("Index must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  min_quantity: z.coerce.number().optional(),
  max_quantity: z.coerce.number().optional(),
  packagePrice: z.coerce.number().positive("Price must be positive"),
  package_type: z.string().min(1, "Lens Type is required"),
  package_design: z.string().min(1, "Design is required"),
  packageImage: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

// Variant schema for sunglass lens packages
export type SunglassLensPackageType = z.infer<typeof SunglassLensPackageSchema>;
export const SunglassLensPackageSchema = z.object({
  company: z.string().min(1, "Company is required"),
  index: z.coerce.number().positive("Index must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  min_quantity: z.coerce.number().optional(),
  max_quantity: z.coerce.number().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  package_design: z.string().min(1, "Design is required"),
  lens_color: z.string().min(1, "Color is required"),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
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
