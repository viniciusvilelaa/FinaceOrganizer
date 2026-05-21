import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/api-error";

//CREATE FINANCIAL GOAL
//Cria meta financeira vinculada ao usuário
export async function createFinancialGoal(userId, payload) {
    const { targetAmount, month, year } = payload;

    if (!useriD) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!targetAmount || !month || !year) {
        throw new ApiError(400, "Missing required payload")
    }

    const goalExist = await prisma.financialGoal.findFirst({
        where: {
            userId: Number(userId),
            month: Number(month),
            year: Number(year)
        }
    });

}