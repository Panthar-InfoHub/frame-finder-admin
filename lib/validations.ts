import { z } from "zod";

export type FrameFormDataType = z.infer<typeof FrameSchema>;
export const FrameSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  frame_color: z.array(z.string()).min(1, "Add at least one frame color"),
  temple_color: z.array(z.string()).min(1, "Add at least one temple color"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  mrp: z.coerce.number().positive("MRP must be positive"),
  base_price: z.coerce.number().positive("Base price must be positive"),
  shipping_price: z.coerce.number().min(0, "Shipping price cannot be negative"),
  price: z.coerce.number().positive("Total price must be positive"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  min_quantity: z.coerce.number().optional(),
  max_quantity: z.coerce.number().optional(),
  images: z.array(z.object({ url: z.string() })).min(1, "Upload at least one image"),
});

export type SunglassFormDataType = z.infer<typeof SunglassSchema>;
export const SunglassSchema = z.object({
  brand_name: z.string().min(1, "Brand name is required"),
  desc: z.string().min(1, "Description is required"),
  frame_color: z.array(z.string()).min(1, "Add at least one frame color"),
  temple_color: z.array(z.string()).min(1, "Add at least one temple color"),
  lens_color: z.array(z.string()).min(1, "Add at least one lens color"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  min_quantity: z.coerce.number().optional(),
  max_quantity: z.coerce.number().optional(),
  is_power: z.boolean("Les Power must be boolean"),
  gender: z.array(z.string()).min(1, "Select at least one gender"),
  style: z.array(z.string()).min(1, "Select at least one style"),
  material: z.array(z.string()).min(1, "Select at least one material"),
  shape: z.array(z.string()).min(1, "Select at least one shape"),
  sizes: z.array(z.string()).min(1, "Select at least one size"),
  hsn_code: z.string().min(1, "HSN/SAC code is required"),
  mrp: z.coerce.number().positive("MRP must be positive"),
  base_price: z.coerce.number().positive("Base price must be positive"),
  shipping_price: z.coerce.number().min(0, "Shipping price cannot be negative"),
  price: z.coerce.number().positive("Total price must be positive"),
  images: z.array(z.object({ url: z.string().url() })).min(1, "Upload at least one image"),
});
