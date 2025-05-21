import { z } from "zod";
import { findUserByEmail } from "../models/userModel";
import { id, patchRefine } from "./common";

const createNameSchema = (prefix: string) =>
  z
    .string()
    .min(1, `${prefix}name is Required`)
    .max(50, `${prefix}name can be a maximum of 50 characters`);

const firstName = createNameSchema("first ");
const lastName = createNameSchema("last ");
const email = z.string().email();

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

export const putUserSchema = z.object({ firstName, lastName });

export const patchUserSchema = putUserSchema
  .partial()
  .refine(patchRefine, { message: "Atleast one field must be present" });

export const userIdParams = z.object({ userId: id });
