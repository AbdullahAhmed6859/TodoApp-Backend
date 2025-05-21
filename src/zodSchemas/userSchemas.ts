import { z } from "zod";
import { findUserByEmail } from "../models/userModel";
import { id } from "./common";

const firstName = z
  .string()
  .min(1, "First Name is Required")
  .max(50, "First name can be a maximum of 50 characters");
const lastName = z
  .string()
  .min(1, "Last Name is Required")
  .max(50, "Last name can be a maximum of 50 characters");

const email = z.string().email("Invalid email");

export const signupSchema = z
  .object({
    firstName,
    lastName,
    email,
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
  email,
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({ firstName, lastName });

export const patchUpdateUserSchema = z.object({
  firstName: firstName.optional(),
  lastName: firstName.optional(),
});

export const userIdParams = z.object({ userId: id });
