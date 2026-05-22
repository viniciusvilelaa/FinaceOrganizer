import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/api-error";

//FUNCTION TO CALCULATE STATUS
function calculateStatus(currentAmount, targetAmount, elapsedDays, percentage) {
    if (currentAmount >= targetAmount) {
        return "ACHIEVED"
    }
    else if (currentAmount < 0) {
        return "FAILED"
    }
    else if (percentage >= elapsedDays) {
        return "ON_TRACK"
    }
    else {
        return "AT_RISK"
    }
}

//CREATE FINANCIAL GOAL
//Cria meta financeira vinculada ao usuário
export async function createFinancialGoal(userId, payload) {
    const { targetAmount, month, year } = payload;


    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }


    if (goalExist) throw new ApiError(409, "A goal already exists for this period");

    const financialGoal = await prisma.financialGoal.create({
        data: {
            targetAmount,
            month,
            year,
            userId: parsedUserId
        }
    })

    return financialGoal;

}


export async function getCurrentGoal(userId) {
    if (!userId) throw new ApiError(401, "User not authenticated");

    const parsedUserId = Number(userId);
    const todayMonth = new Date().getMonth() + 1;
    const todayYear = new Date().getFullYear();

    const actualGoal = await prisma.financialGoal.findFirst({
        where: {
            userId: parsedUserId,
            month: todayMonth,
            year: todayYear
        }
    })

    if (!actualGoal) throw new ApiError(404, "Actual goal not found or not exists");

    const startDate = new Date(actualGoal.year, actualGoal.month - 1, 1);
    const endDate = new Date(actualGoal.year, actualGoal.month, 1);


    const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                userId: parsedUserId,
                type: "INCOME",
                date: {
                    gte: startDate,
                    lt: endDate
                }
            },
            _sum: {
                amount: true,
            }
        }),
        prisma.transaction.aggregate({
            where: {
                userId: parsedUserId,
                type: "EXPENSE",
                date: {
                    gte: startDate,
                    lt: endDate
                }
            },
            _sum: {
                amount: true,
            }
        })

    ]);

    const currentAmount = (income._sum.amount || 0) - (expense._sum.amount || 0)

    const progessionPercentage = actualGoal.targetAmount > 0
        ? (currentAmount / actualGoal.targetAmount) * 100
        : 0;


    const todayDay = new Date().getDate()
    const totalDays = new Date(actualGoal.year, actualGoal.month, 0).getDate();

    const elapsedDays = (todayDay / totalDays) * 100;

    const status = calculateStatus(currentAmount, actualGoal.targetAmount, elapsedDays, progessionPercentage)

    return {
        id: actualGoal.id,
        targetAmount: actualGoal.targetAmount,
        currentAmount,
        percentage: progessionPercentage,
        month: actualGoal.month,
        year: actualGoal.year,
        status
    }


}

export async function updateGoal(userId, goalId, targetAmount) {

    if (!userId) throw new ApiError(401, "User not authenticated");
    if (!goalId) throw new ApiError(400, "Goal Id is required");

    const parsedTargetAmount = Number(targetAmount);
    if (isNaN(parsedTargetAmount) || parsedTargetAmount < 0) throw new ApiError(400, "Target amount must be a positive number");


    const parsedUserId = Number(userId);
    const parsedGoalId = Number(goalId);

    const goal = await prisma.financialGoal.findFirst({
        where: {
            id: parsedGoalId,
            userId: parsedUserId,
        }
    })

    if (!goal) throw new ApiError(404, "Goal not found");

    return prisma.financialGoal.update({ where: { id: parsedGoalId, }, data: { targetAmount: parsedTargetAmount } });

}

export async function deleteGoal(userId, goalId) {
    if (!userId) throw new ApiError(401, "User not authenticated");
    if (!goalId) throw new ApiError(400, "Goal Id is required");

    const parsedUserId = Number(userId);
    const parsedGoalId = Number(goalId);

    const goal = await prisma.financialGoal.findFirst({
        where: {
            id: parsedGoalId,
            userId: parsedUserId,
        }
    })

    if (!goal) throw new ApiError(404, "Goal not found");

    return prisma.financialGoal.delete({ where: { id: parsedGoalId } });


}