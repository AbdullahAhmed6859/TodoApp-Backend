import { loginSchema, signupSchema } from "../zodSchemas/authSchemas";
import { createUser, findUserByEmail } from "../models/userModel";
import { generateToken } from "../utils/jwt";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function signUp(req: Request, res: Response) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { firstName, lastName, email, password } = result.data;
  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function logIn(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
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
    res.status(500).json({ error: "Server error" });
  }
}
