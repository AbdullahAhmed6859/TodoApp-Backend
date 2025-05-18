import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function generateToken(id: number): string {
  return sign({ id }, JWT_SECRET) as string;
}

export function verifyToken(token: string): JwtPayload {
  return verify(token, JWT_SECRET) as JwtPayload;
}
