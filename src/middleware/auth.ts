import type { ExpressHandler } from "../types/expressHandlers";
import { verifyToken } from "../utils/jwt";

export const protect: ExpressHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or invalid" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { id: number };
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
