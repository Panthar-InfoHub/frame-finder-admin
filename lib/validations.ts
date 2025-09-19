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
