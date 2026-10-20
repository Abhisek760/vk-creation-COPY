import { CustomerDetails } from "@/types/customer";

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CustomerDetails, string>>;
}

export function validateCustomer(
  customer: CustomerDetails
): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!customer.name.trim()) {
    errors.name = "Customer name is required";
  }

  if (!customer.phone.trim()) {
    errors.phone = "Phone number is required";
  }

  if (
    customer.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
  ) {
    errors.email = "Invalid email address";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}