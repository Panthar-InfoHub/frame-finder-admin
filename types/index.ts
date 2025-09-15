// Export all types
export * from "./vendor";

export interface FormServerActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}
