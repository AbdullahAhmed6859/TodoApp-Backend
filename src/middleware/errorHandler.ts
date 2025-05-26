// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  sendResponse,
  serverError,
  zodErrorBadRequest,
} from "../utils/sendResponse";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   Handle Zod validation errors
  if (err instanceof ZodError) {
    return zodErrorBadRequest(res, err);
  }

  // Handle known AppErrors
  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, {
      message: err.message,
      errors: err.errors ?? null,
    });
  }

  // Handle generic errors
  if (err instanceof Error) {
    return sendResponse(res, 500, {
      message: err.message || "Internal server error",
    });
  }

  // Catch-all fallback
  return serverError(res);
};
