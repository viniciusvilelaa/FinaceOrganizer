import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

//CREATE TRANSACTION
// Cria transação vinculada ao usuário autenticado.
export async function createTransaction(userId, payload) {
  const { amount, type, category, description, date } = payload;

  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  if (!amount || !type || !description || !date || !category) {
    throw new ApiError(400, "Missing required fields.");
  }

  const transaction = await prisma.transaction.create({
    data: {
      Amount: Number(amount),
      Type: type,
      Category: category,
      Description: description,
      Date: new Date(date),
      userId: Number(userId),
    },
  });

  return transaction;
}

//GET ALL TRANSACTIONS
// Lista todas as transações do usuário autenticado.
export async function getAllTransactions(userId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  return prisma.transaction.findMany({
    where: { userId: Number(userId) },
    orderBy: { Date: "desc" },
  });
}

//GET TRANSACTION BY ID
// Busca uma transação por id garantindo ownership.
export async function getTransactionById(userId, transactionId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  if (!transactionId) {
    throw new ApiError(400, "Transaction id is required.");
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(transactionId),
      userId: Number(userId),
    },
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found.");
  }

  return transaction;
}

//DELETE TRANSACTION
// Remove transação somente se pertencer ao usuário.
export async function deleteTransaction(userId, transactionId) {
  const transaction = await getTransactionById(userId, transactionId);

  await prisma.transaction.delete({
    where: { id: transaction.id },
  });

  return { message: "Transaction deleted successfully." };
}
