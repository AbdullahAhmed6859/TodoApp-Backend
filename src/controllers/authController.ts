import { loginSchema, signupSchema } from "../zod-schemas/userSchemas";
import { createUser, findUserByEmail } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { ExpressHandler } from "../types/expressHandlers";
import { compare } from "bcrypt";
import {
  created,
  duplicate,
  ok,
  unauthorized,
  zodBadRequest,
} from "../utils/sendResponse";
import { catchAsync } from "../utils/catchAsync";

export const signUp = catchAsync(async (req, res, next) => {
  const result = await signupSchema.safeParseAsync(req.body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    if (fieldErrors.email?.includes("Email already in use")) {
      return duplicate(res, {
        errors: { email: ["Email already in use"] },
        message: "User with this email alread exists",
      });
    }

    return zodBadRequest(res, result);
  }

  const newUser = await createUser(result.data);

  const token = generateToken(newUser.id);

  return created(res, {
    data: {
      user: newUser,
      token,
    },
    message: "SignUp complete",
  });
});

export const logIn = catchAsync(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return zodBadRequest(res, result);
  }

  const { email, password } = result.data;

  const user = await findUserByEmail(email);
  if (!user || !(await compare(password, user.password))) {
    return unauthorized(res, { message: "Invalid email or password" });
  }

  const token = generateToken(user.id);
  return ok(res, {
    data: {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
      token,
    },
    message: "User Logged In",
  });
});

export const testProtect: ExpressHandler = (req, res) => {
  return ok(res, {
    data: { userId: req.userId },
    message: "Auth middleware is working",
  });
};
