import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

//CREATE USER
// Cria um novo usuário e devolve token de autenticação.
export async function createUser({ name, email, password }) {
  // Validação básica de payload.
  if (!name || !email || !password) {
    throw new ApiError(400, "Missing required fields.");
  }

  // Evita cadastro duplicado por e-mail.
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already in use.");
  }

  // Hash da senha antes de persistir no banco.
  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

  // Cria usuário e retorna apenas campos públicos.
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Gera JWT para sessão inicial após o cadastro.
  const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return { user, token };
}

//GET USER
// Busca usuário por id sem expor dados sensíveis.
export async function getUser(userId) {
  // Garante que o id foi informado.
  if (!userId) {
    throw new ApiError(400, "User id is required.");
  }

  // Recupera usuário por chave primária.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      transactions: true,
    },
  });

  // Retorna 404 quando usuário não existe.
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
}

//GET ME
// Retorna o usuário autenticado baseado no token JWT.
export async function getMe(userId) {
  return getUser(userId);
}


//LOGIN USER
// Autentica usuário com e-mail/senha e retorna token JWT.
export async function loginUser({ email, password }) {
  // Validação básica de credenciais.
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  // Busca usuário por e-mail incluindo hash para validação de senha.
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Evita detalhar se o e-mail existe ou não.
  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Compara senha informada com hash salvo no banco.
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  // Gera token de autenticação para uso nas rotas protegidas.
  const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  // Remove dados sensíveis antes de devolver o usuário.
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: safeUser, token };
}
