// utils/sendResponse.ts
import { Response } from "express";
import { SafeParseError, SafeParseReturnType } from "zod";

type Data = object | null;
type Errors = object | null;
type Message = string | null;

type ResponseOptions = {
  data?: Data;
  errors?: Errors;
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

export const ok = (res: Response, options: ResponseOptions) =>
  sendResponse(res, 200, options);

export const created = (res: Response, options: ResponseOptions) =>
  sendResponse(res, 201, mergeDefaultMessage(options, { message: "created" }));

export const badRequest = (res: Response, options: ResponseOptions = {}) =>
  sendResponse(
    res,
    400,
    mergeDefaultMessage(options, { message: "Bad request" })
  );

export const serverError = (res: Response) =>
  sendResponse(res, 500, { message: "Server error" });

export const unauthorized = (res: Response, options: ResponseOptions = {}) =>
  sendResponse(
    res,
    401,
    mergeDefaultMessage(options, { message: "Unauthorized" })
  );

export const duplicate = (res: Response, options: ResponseOptions) =>
  sendResponse(
    res,
    409,
    mergeDefaultMessage(options, { message: "Duplicate Entry" })
  );

export const notFound = (res: Response, options: ResponseOptions = {}) =>
  sendResponse(
    res,
    404,
    mergeDefaultMessage(options, { message: "Resource not found" })
  );

export const deleted = (res: Response) => sendResponse(res, 204, {});

export const zodBadRequest = (res: Response, zodResult: SafeParseError<any>) =>
  badRequest(res, { errors: zodResult.error.flatten().fieldErrors });

function mergeDefaultMessage(
  options: ResponseOptions = {},
  defaultOptions: ResponseOptions = {}
): ResponseOptions {
  options.message = options.message ?? defaultOptions.message ?? null;
  return options;
}
