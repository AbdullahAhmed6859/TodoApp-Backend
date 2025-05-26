export class AppError extends Error {
  statusCode: number;
  errors?: object;

  constructor(message = "error", statusCode = 500, errors?: object) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // Static methods for common error types
  static unauthorized(message = "Unauthorized", errors?: object) {
    throw new AppError(message, 401, errors);
  }

  static notFound(message = "Resource not found", errors?: object) {
    throw new AppError(message, 404, errors);
  }

  static badRequest(message = "Bad request", errors?: object) {
    throw new AppError(message, 400, errors);
  }

  static forbidden(message = "Forbidden", errors?: object) {
    throw new AppError(message, 403, errors);
  }

  static conflict(message = "Resource already exists", errors?: object) {
    throw new AppError(message, 409, errors);
  }
}
