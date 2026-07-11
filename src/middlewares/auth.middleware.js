import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

//Funcao de middleware para verificar se existe o token no cookies
export function authMiddleware(req, res, next) {
  //Obtem token pelo cookie
  const auth_token = req.cookies['auth_token'];

  //Verifica se existe o token
  if (!auth_token) {
    throw new ApiError(401, "User not authenticated");
  }

  //Try para decodificar o jwt e passar payload do user
  try {
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);

    req.user = {
      sub: decoded.sub,
      email: decoded.email
    }

    return next()
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  
}
