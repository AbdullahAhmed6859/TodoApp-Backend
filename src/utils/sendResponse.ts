// utils/sendResponse.ts
import { Response } from "express";

type Data = object | null;
type Errors = object | null;
type Message = string | null;

type UserInput = {
  data?: Data;
  errors?: Errors;
  message?: Message;
};

type ApiResponse = UserInput & {
  success?: boolean;
};

export function sendResponse(
  res: Response,
  statusCode: number,
  { data = null, errors = null, message = null }: UserInput = {}
): undefined {
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

export const ok = (res: Response, data?: Data, message?: Message) =>
  sendResponse(res, 200, { data, message });

export const created = (res: Response, data?: Data, message = "Created") =>
  sendResponse(res, 201, { data, message });

export const badRequest = (
  res: Response,
  errors?: Errors,
  message = "Bad request"
) => sendResponse(res, 400, { errors, message });

export const serverError = (res: Response, message = "Server error") =>
  sendResponse(res, 500, { message });

export const unauthorized = (res: Response, message = "Unauthorized") =>
  sendResponse(res, 401, { message });

export const duplicate = (
  res: Response,
  errors?: Errors,
  message = "Duplicate Entry"
) => sendResponse(res, 409, { errors, message });

export const notFound = (res: Response, message = "Resource not found") =>
  sendResponse(res, 404, { message });

export const deleted = (res: Response) => sendResponse(res, 204);
