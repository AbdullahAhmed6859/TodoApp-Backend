// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { serverError, zodErrorBadRequest } from "../utils/sendResponse";

export class HttpError extends Error {
  statusCode: number;
  errors?: object;

  constructor(message: string, statusCode = 500, errors?: object) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

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
  console.error(err);
  return serverError(res);

  //   // Handle known HttpErrors
  //   if (err instanceof HttpError) {
  //     return sendResponse(res, err.statusCode, {
  //       message: err.message,
  //       errors: err.errors ?? null,
  //     });
  //   }

  //   // Handle generic errors
  //   if (err instanceof Error) {
  //     return sendResponse(res, 500, {
  //       message: err.message || "Internal server error",
  //     });
  //   }

  //   // Catch-all fallback
  //   return sendResponse(res, 500, {
  //     message: "Unknown error occurred",
  //   });
};

//   if (!result) {
//     const fieldErrors = result.error.flatten().fieldErrors;

//     if (fieldErrors.email?.includes("Email already in use")) {
//       return duplicate(res, {
//         errors: { email: ["Email already in use"] },
//         message: "User with this email alread exists",
//       });
//     }
