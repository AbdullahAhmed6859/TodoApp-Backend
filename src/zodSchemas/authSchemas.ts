import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, "Required")
    .max(50, "First name can be a maximum of 50 characters"),
  lastName: z
    .string()
    .min(1, "Required")
    .max(50, "Last name can be a maximum of 50 characters"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password cannot be more that 32 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
