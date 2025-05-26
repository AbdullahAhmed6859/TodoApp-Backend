import { z } from "zod";
import { signupSchema } from "../zod-schemas/userSchemas";
import { createUser, userWithEmailExists } from "../models/userModel";
import { AppError } from "../utils/AppError";

export async function createUserService(
  userDetails: z.infer<typeof signupSchema>
) {
  const { email } = userDetails;

  if (await userWithEmailExists(email)) {
    AppError.conflict("User with this email already exists", {
      email: "This email is already in use",
    });
  }

  return createUser(userDetails);
}
