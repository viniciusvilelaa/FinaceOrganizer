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
      amount: Number(amount),
      type: type,
      category: category,
      description: description,
      date: new Date(date),
      userId: Number(userId),
    },
  });

  return transaction;
}

//GET ALL TRANSACTIONS
// Lista todas as transações do usuário autenticado.
export async function getAllTransactions(userId, filters) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  //Verificando se existem filtros vindo da requisicao
  const whereClauses = {
    userId: Number(userId)
  };

  if (filters?.category) {
    whereClauses.category = filters.category;
  }

  if (filters?.description) {
    whereClauses.description = {
      contains: filters.description
    };

  }

  if(filters?.type){
    whereClauses.type = filters.type;
  }

  //Logica para filtro de data
  if (filters?.period) {
    const today = new Date();
    const startDate = new Date();

    switch (filters.period) {
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '3m':
        startDate.setMonth(today.getMonth() - 3);
        break
      case '1y':
        startDate.setFullYear(today.getFullYear() - 1);
        break
    }

    whereClauses.date = {
      gte: startDate,
      lte: today
    };

  }


  //Busca inteligente utilizando objeto where criado dinamicamente com filtros
  return prisma.transaction.findMany({
    where: whereClauses,
    orderBy: { date: "desc" },
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

  return { message: `Transaction ${transactionId} deleted successfully.` };
}

export async function getSummary(userId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const incomeTransactions = await prisma.transaction.aggregate({
    where: {
      userId: Number(userId),
      type: "INCOME"
    },
    _sum: {
      amount: true,
    }
  });

  const expenseTransactions = await prisma.transaction.aggregate({
    where: {
      userId: Number(userId),
      type: "EXPENSE"
    },
    _sum: {
      amount: true,
    }
  });

  const totalIncome = incomeTransactions._sum.amount || 0;
  const totalExpense = expenseTransactions._sum.amount || 0;
  const totalBalance = totalIncome - totalExpense;

  return { totalBalance, totalExpense, totalIncome }

}

export async function getMonthlySummary(userId) {
  const todayDate = new Date();

  const initialMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const nextMonth = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 1);


  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const incomeTransactions = await prisma.transaction.aggregate({
    where: {
      userId: Number(userId),
      type: "INCOME",
      date: {
        gte: initialMonth,
        lt: nextMonth
      }
    },
    _sum: {
      amount: true,
    }
  });

  const expenseTransactions = await prisma.transaction.aggregate({
    where: {
      userId: Number(userId),
      type: "EXPENSE",
      date: {
        gte: initialMonth,
        lt: nextMonth
      }
    },
    _sum: {
      amount: true,
    }
  });

  const totalMonthIncome = incomeTransactions._sum.amount || 0;
  const totalMonthExpense = expenseTransactions._sum.amount || 0;

  return { totalMonthExpense, totalMonthIncome }
}