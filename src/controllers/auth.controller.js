import { ApiError } from "../utils/api-error.js";
import { loginUser, registerUser } from "../services/auth.service.js";

function validateAuthBody(body, isRegister = false) {
  const { email, password, name } = body;

  if (!email || !password || (isRegister && !name)) {
    throw new ApiError(400, "Missing required fields.");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(400, "Invalid payload.");
  }

  if (isRegister && typeof name !== "string") {
    throw new ApiError(400, "Invalid payload.");
  }
}

export async function register(req, res) {
  validateAuthBody(req.body, true);
  const user = await registerUser(req.body);
  return res.status(201).json({ user });
}

export async function login(req, res) {
  validateAuthBody(req.body);
  const data = await loginUser(req.body);
  return res.status(200).json(data);
}
