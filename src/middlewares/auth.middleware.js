import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid authorization header.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }
}
