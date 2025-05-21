import { loginSchema, signupSchema } from "../zodSchemas/userSchemas";
import { createUser, findUserByEmail } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { ExpressHandler, ExpressHandlerAsync } from "../types/expressHandlers";
import { compare } from "bcrypt";
import {
  badRequest,
  created,
  duplicate,
  ok,
  serverError,
  unauthorized,
  zodbadRequest,
} from "../utils/sendResponse";

export const signUp: ExpressHandlerAsync = async (req, res) => {
  const result = await signupSchema.safeParseAsync(req.body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    if (fieldErrors.email?.includes("Email already in use")) {
      return duplicate(res, {
        data: { email: ["Email already in use"] },
        message: "User with this email alread exists",
      });
    }

    return zodbadRequest(res, result);
  }

  try {
    const newUser = await createUser(result.data);

    const token = generateToken(newUser.id);

    return created(res, {
      data: {
        user: newUser,
        token,
      },
      message: "SignUp complete",
    });
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const logIn: ExpressHandlerAsync = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return zodbadRequest(res, result);
  }

  const { email, password } = result.data;

  try {
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
  } catch (err) {
    console.error(err);
    return serverError(res);
  }
};

export const testProtect: ExpressHandler = (req, res) => {
  return ok(res, {
    data: { userId: req.userId },
    message: "Auth middleware is working",
  });
};
