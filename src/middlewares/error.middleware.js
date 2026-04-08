import { env } from "../config/env.js";

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode ?? 500;

  if (env.nodeEnv !== "test") {
    console.error(error);
  }

  return res.status(statusCode).json({
    message: error.message || "Internal server error.",
    ...(env.nodeEnv === "development" && { stack: error.stack }),
  });
}
