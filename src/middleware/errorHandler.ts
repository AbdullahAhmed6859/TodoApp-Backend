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
  // Log error for debugging (consider a better logging solution in production)
  console.error(err);

  // Handle Zod validation errors
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

  // Handle PostgreSQL errors
  if (typeof err === "object" && err !== null && "code" in err) {
    const pgError = err as {
      code: string;
      detail?: string;
      constraint?: string;
    };

    // Handle unique constraint violations
    if (pgError.code === "23505") {
      return sendResponse(res, 409, {
        message: "Resource already exists",
        errors: {
          detail:
            pgError.detail || "A resource with these details already exists",
          constraint: pgError.constraint,
        },
      });
    }

    // Handle foreign key violations
    if (pgError.code === "23503") {
      return sendResponse(res, 400, {
        message: "Invalid reference",
        errors: {
          detail: pgError.detail || "Referenced resource does not exist",
          constraint: pgError.constraint,
        },
      });
    }
  }

  // Handle generic errors
  if (err instanceof Error) {
    return sendResponse(res, 500, {
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
  }

  // Catch-all fallback
  return serverError(res);
};
