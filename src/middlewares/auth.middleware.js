import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export function authMiddleware(req, res, next) {
  const auth_token = req.cookies['auth_token'];

  if(!auth_token){
    throw new ApiError(401, "User not authenticated");
  }

  try{
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.sub,
      email: decoded.email
    }

    return next()
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
