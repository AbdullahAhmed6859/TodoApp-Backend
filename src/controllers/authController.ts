import { loginSchema, signupSchema } from "../zod-schemas/userSchemas";
import { findUserByEmail } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { ExpressHandler } from "../types/expressHandlers";
import { compare } from "bcrypt";
import { created, ok } from "../utils/sendResponse";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { createUserService } from "../services/userServices";

export const signUp = catchAsync(async (req, res, next) => {
  const data = signupSchema.parse(req.body);
  const newUser = await createUserService(data);
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
  const { email, password } = loginSchema.parse(req.body);

  const user = await findUserByEmail(email);
  if (!user || !(await compare(password, user.password))) {
    AppError.unauthorized("Invalid email or password");
  }
  delete user.password;
  const token = generateToken(user.id);

  return ok(res, {
    data: {
      user,
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
