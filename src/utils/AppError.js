
// Define a class that extends the built-in error object
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // call the parent class constructor with the error message.

    this.statusCode = statusCode; // set HTTP status code (e.g, 404, 400, 500)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Mark this as an expected, handled error

    // Captures the exact location of the error in the stack trace, excluding the constructor function itself
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
