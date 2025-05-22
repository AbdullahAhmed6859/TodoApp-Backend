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
  sendResponse(res, 201, mergeDefaultMessage(options, { message: "created" }));

export const badRequest = (res: Response, options: ErrorsMessage = {}) =>
  sendResponse(
    res,
    400,
    mergeDefaultMessage(options, { message: "Bad request" })
  );

export const serverError = (res: Response) =>
  sendResponse(res, 500, { message: "Server error" });

export const unauthorized = (res: Response, options: ErrorsMessage = {}) =>
  sendResponse(
    res,
    401,
    mergeDefaultMessage(options, { message: "Unauthorized" })
  );

export const duplicate = (res: Response, options: ErrorsMessage = {}) =>
  sendResponse(
    res,
    409,
    mergeDefaultMessage(options, { message: "Duplicate Entry" })
  );

export const notFound = (res: Response, options: ErrorsMessage = {}) =>
  sendResponse(
    res,
    404,
    mergeDefaultMessage(options, { message: "Resource not found" })
  );

export const deleted = (res: Response) => sendResponse(res, 204);

export const conflict = (res: Response, message?: Message) =>
  sendResponse(res, 409, { message });

export const zodBadRequest = (
  res: Response,
  zodResult: SafeParseError<any>
) => {
  badRequest(res, {
    message: "validation error",
    errors: zodResult.error.flatten().fieldErrors,
  });
};

export const zodErrorBadRequest = (res: Response, zodResult: ZodError) => {
  badRequest(res, {
    message: "validation error",
    errors: zodResult.flatten().fieldErrors,
  });
};

function mergeDefaultMessage(
  options: ResponseOptions = {},
  defaultOptions: ResponseOptions = {}
): ResponseOptions {
  options.message = options.message ?? defaultOptions.message ?? null;
  return options;
}
