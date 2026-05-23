import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/api-error.js";

//FUNCTION TO CALCULATE STATUS
function calculateStatus(currentAmount, targetAmount, elapsedDays, percentage) {
    //Verificaçao do status atual da meta
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

    const parsedUserId = Number(userId);

    const goalExist = await prisma.financialGoal.findFirst({
        where: {
            userId: parsedUserId,
            month,
            year
        }
    });

    if (goalExist) throw new ApiError(409, "A goal already exists for this period");

    const financialGoal = await prisma.financialGoal.create({
        data: {
            targetAmount,
            month,
            year,
            userId: parsedUserId
        }
    });

    return financialGoal;

}


export async function getCurrentGoal(userId) {
    if (!userId) throw new ApiError(401, "User not authenticated");

    const parsedUserId = Number(userId);
    const todayMonth = new Date().getUTCMonth() + 1;
    const todayYear = new Date().getUTCFullYear();

    const actualGoal = await prisma.financialGoal.findFirst({
        where: {
            userId: parsedUserId,
            month: todayMonth,
            year: todayYear
        }
    })

    if (!actualGoal) throw new ApiError(404, "Actual goal not found or not exists");

    const startDate = new Date(Date.UTC(actualGoal.year, actualGoal.month - 1, 1));
    const endDate = new Date(Date.UTC(actualGoal.year, actualGoal.month, 1));


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

    const currentAmount = Number(((income._sum.amount || 0) - (expense._sum.amount || 0)).toFixed(2));

    const progessionPercentage = actualGoal.targetAmount > 0
        ? (currentAmount / actualGoal.targetAmount) * 100
        : 0;


    const todayDay = new Date().getUTCDate()
    const totalDays = new Date(Date.UTC(actualGoal.year, actualGoal.month, 0)).getUTCDate();

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
    const parsedUserId = Number(userId);
    const parsedGoalId = Number(goalId);

    const goal = await prisma.financialGoal.findFirst({
        where: {
            id: parsedGoalId,
            userId: parsedUserId,
        }
    })

    if (!goal) throw new ApiError(404, "Goal not found");

    return prisma.financialGoal.update({ where: { id: parsedGoalId, userId: parsedUserId }, data: { targetAmount: parsedTargetAmount } });

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

    return prisma.financialGoal.delete({ where: { id: parsedGoalId, userId: parsedUserId } });


}

export async function getGoalHistory(userId) {
    if (!userId) throw new ApiError(401, "User not authenticated");
    const parsedUserId = Number(userId);
    const todayMonth = new Date().getUTCMonth() + 1;
    const todayYear = new Date().getUTCFullYear();

    const goals = await prisma.financialGoal.findMany({
        where: {
            userId: parsedUserId,
            OR: [{
                year: { lt: todayYear }
            },
            {
                year: todayYear,
                month: { lte: todayMonth }
            }]
        },
        orderBy: [
            { year: "desc" },
            { month: "desc" }
        ],
        take: 12
    });

    const enchancedGoals = await Promise.all(goals.map(async (goal) => {
        const startDate = new Date(Date.UTC(goal.year, goal.month - 1, 1));
        const endDate = new Date(Date.UTC(goal.year, goal.month, 1));

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
                    amount: true
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

        const currentAmount = Number(((income._sum.amount || 0) - (expense._sum.amount || 0)).toFixed(2));
        const achieved = currentAmount >= goal.targetAmount
        let status

        if (goal.month === todayMonth && goal.year === todayYear) {
            status = "IN_PROGRESS"
        } else if (achieved) {
            status = "ACHIEVED"
        } else {
            status = "FAILED"
        }


        return {
            id: goal.id,
            targetAmount: goal.targetAmount,
            currentAmount,
            month: goal.month,
            year: goal.year,
            achieved,
            status
        }

    }));


    return enchancedGoals

}