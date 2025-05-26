export class AppError extends Error {
  statusCode: number;
  errors?: object;

  constructor(message = "error", statusCode = 500, errors?: object) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
