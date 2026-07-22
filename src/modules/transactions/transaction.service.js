import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { findUsableCategory } from "../category/category.service.js";

//CREATE TRANSACTION
// Cria transação vinculada ao usuário autenticado.
export async function createTransaction(userId, payload) {
  const { amount, type, categoryId, description, date } = payload;

  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  if (!amount || !type || !description || !date || !categoryId) {
    throw new ApiError(400, "Missing required fields.");
  }

  await findUsableCategory(userId, categoryId);

  const transaction = await prisma.transaction.create({
    data: {
      amount: Number(amount),
      type: type,
      categoryId: categoryId,
      description: description,
      date: new Date(date),
      userId: Number(userId),
    },
  });

  return transaction;
}

//UPDATE TRANSACTION
export async function updateTransaction(userId, transactionId, payload) {
  const transaction = await getTransactionById(userId, transactionId);

  const { amount, type, categoryId, description, date } = payload;

  if (categoryId) {
    await findUsableCategory(userId, categoryId);
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(type !== undefined && { type }),
      ...(categoryId !== undefined && { categoryId }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date: new Date(date) }),
    },
    include: { category: true },
  });

  return updatedTransaction;
}

//GET ALL TRANSACTIONS
export async function getAllTransactions(userId, filters) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const whereClauses = {
    userId: Number(userId)
  };

  if (filters?.categoryId) {
    whereClauses.categoryId = filters.categoryId;
  }

  if (filters?.description) {
    whereClauses.description = {
      contains: filters.description
    };
  }

  if (filters?.type) {
    whereClauses.type = filters.type;
  }

  if (filters?.period) {
    const today = new Date();
    const startDate = new Date();

    switch (filters.period) {
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '3m':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }

    whereClauses.date = {
      gte: startDate,
      lte: today
    };
  }

  const page = Number(filters?.page) || 1;
  const limit = Number(filters?.limit) || 5;
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClauses,
      orderBy: { date: "desc" },
      skip,
      take: limit,
      include: { category: true },
    }),
    prisma.transaction.count({ where: whereClauses })
  ]);

  return { transactions, total, page, limit };
}

//GET TRANSACTION BY ID
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
    include: { category: true },
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

export async function getChartData(userId) {
  if (!userId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const today = new Date();

  const arrayDates = Array.from({ length: 6 }, (_, i) => {
    return new Date(today.getFullYear(), today.getMonth() - i, 1);
  });

  const chartData = await Promise.all(
    arrayDates.map(async (date) => {
      const startOfMonth = date;
      const startOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId: Number(userId),
            type: "INCOME",
            date: { gte: startOfMonth, lt: startOfNextMonth }
          },
          _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
          where: {
            userId: Number(userId),
            type: "EXPENSE",
            date: { gte: startOfMonth, lt: startOfNextMonth }
          },
          _sum: { amount: true }
        })
      ]);

      return {
        month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
        income: income._sum.amount || 0,
        expense: expense._sum.amount || 0,
      };
    })
  );

  return chartData.reverse();
}

export async function getPizzaChart(userId) {
  const parsedUserId = Number(userId);

  if (!parsedUserId) {
    throw new ApiError(401, "User not authenticated.");
  }

  const transactions = await prisma.transaction.groupBy({
    by: ['category'],
    where: {
      userId: parsedUserId,
      type: 'EXPENSE'
    },
    _sum: { amount: true }
  })

  return transactions.map(t => ({
    category: t.category,
    total: t._sum.amount || 0
  }))
}