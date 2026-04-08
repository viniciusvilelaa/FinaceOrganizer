import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../config/env.js";

const globalForPrisma = globalThis;

const adapter = new PrismaMariaDb({
  host: new URL(env.databaseUrl).hostname,
  port: Number(new URL(env.databaseUrl).port || 3306),
  user: decodeURIComponent(new URL(env.databaseUrl).username),
  password: decodeURIComponent(new URL(env.databaseUrl).password),
  database: new URL(env.databaseUrl).pathname.replace("/", ""),
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.nodeEnv === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}
