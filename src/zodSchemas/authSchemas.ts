import { z } from "zod";
import { findUserByEmail } from "../models/userModel";

export const signupSchema = z
  .object({
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
      .max(32, "Password cannot be more than 32 characters"),
  })
  .superRefine(async (data, ctx) => {
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      ctx.addIssue({
        path: ["email"],
        code: z.ZodIssueCode.custom,
        message: "Email already in use",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
