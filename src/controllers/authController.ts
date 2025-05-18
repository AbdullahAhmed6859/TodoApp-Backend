import { loginSchema, signupSchema } from "../zodSchemas/authSchemas";
import { createUser, findUserByEmail } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { ExpressHandler, ExpressHandlerAsync } from "../types/expressHandlers";
import { compare } from "bcrypt";

export const signUp: ExpressHandlerAsync = async (req, res) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({ success: false, errors: result.error.flatten().fieldErrors });
    return;
  }

  const { firstName, lastName, email, password } = result.data;
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json({ success: false, error: "Email already in use" });
      return;
    }

    const newUser = await createUser(firstName, lastName, email, password);

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const logIn: ExpressHandlerAsync = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({ success: false, errors: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
      return;
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const testProtect: ExpressHandler = (req, res) => {
  res.status(200).json({
    success: true,
    userId: req.userId,
    message: "Your token is valid",
  });
};
