// utils/sendResponse.ts
import { Response } from "express";
import { SafeParseError, SafeParseReturnType, ZodError } from "zod";

type Data = { [key: string]: any } | null;
type Errors = object | null;
type Message = string | null;

type ResponseOptions = {
  data?: Data;
  errors?: Errors;
  message?: Message;
};

type ErrorsMessage = {
  errors?: Errors;
  message?: Message;
};

type DataMessage = {
  data?: Errors;
  message?: Message;
};

type ApiResponse = ResponseOptions & {
  success: boolean;
};

export function sendResponse(
  res: Response,
  statusCode: number,
  options: ResponseOptions = {}
): void {
  const { data = null, errors = null, message = null } = options;
  const success = statusCode < 400;

  const response: ApiResponse = {
    success,
    data,
    errors,
    message,
  };

  res.status(statusCode).json(response);
  return;
}

export const ok = (res: Response, options: DataMessage = {}) =>
  sendResponse(res, 200, options);

export const created = (res: Response, options: DataMessage = {}) =>
  sendResponse(res, 201, options);

export const deleted = (res: Response) => sendResponse(res, 204);

export const zodErrorBadRequest = (res: Response, err: ZodError) => {
  const formattedErrors: Record<string, string> = {};
  err.errors.forEach((issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !formattedErrors[field]) {
      formattedErrors[field] = issue.message;
    }
  });
  sendResponse(res, 400, {
    errors: formattedErrors,
    message: "Validation Error",
  });
};

export const serverError = (res: Response) =>
  sendResponse(res, 500, { message: "Unknown error Occured" });

function mergeDefaultMessage(
  options: ResponseOptions = {},
  defaultOptions: ResponseOptions = {}
): ResponseOptions {
  options.message = options.message ?? defaultOptions.message ?? null;
  return options;
}
