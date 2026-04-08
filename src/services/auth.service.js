import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export async function registerUser({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new ApiError(409, "Email is already in use.");
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return user;
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
