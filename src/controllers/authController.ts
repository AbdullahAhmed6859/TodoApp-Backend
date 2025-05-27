import { loginSchema, signupSchema } from "../zod-schemas/userSchemas";
import { generateToken } from "../utils/jwt";
import { created, ok } from "../utils/sendResponse";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { UserService } from "../services/user.service";

export const signUp = catchAsync(async (req, res, next) => {
  const data = signupSchema.parse(req.body);
  const newUser = await UserService.create(data);
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

  const user = await UserService.findByEmail(email);
  if (!user || !(await UserService.comparePassword(password, user.password))) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(user.id);

  return ok(res, {
    data: {
      user: userWithoutPassword,
      token,
    },
    message: "User Logged In",
  });
});

export const testProtect = catchAsync(async (req, res, next) => {
  return ok(res, {
    data: { userId: req.userId },
    message: "Auth middleware is working",
  });
});
