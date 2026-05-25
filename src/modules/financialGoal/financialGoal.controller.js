import * as financialGoalService from "./financialGoal.service.js";
import { financialGoalSchema, goalParamsSchema } from "./financialGoal.schema.js";
import { ApiError } from "../../utils/api-error.js";

//Endpoint POST GOAL
export const createFinancialGoal = async (req, res) => {
    try {
        const userId = req.user.sub;
        const bodyParsed = financialGoalSchema.safeParse(req.body);

        if (!bodyParsed.success) {
            return res.status(400).json({
                message: 'Invalid inputs for create a goal',
                error: bodyParsed.error.flatten().fieldErrors
            });
        }

        const financialGoal = await financialGoalService.createFinancialGoal(userId, bodyParsed.data);

        return res.status(201).json(financialGoal);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

//Endpoint GET GOALS
export const getHistoryGoal = async (req, res) => {

    try {
        const userId = req.user.sub;

        const financialGoals = await financialGoalService.getGoalHistory(userId);

        return res.status(200).json(financialGoals);

    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message })
        } else {
            return res.status(500).json({ message: 'Internal server error' })
        }
    }


}

//Endpoint getCurrentGoal que retorna dados da meta atual
export const getCurrentGoal = async (req, res) => {
    try {
        const userId = req.user.sub;

        const currentFinancialGoal = await financialGoalService.getCurrentGoal(userId);

        return res.status(200).json(currentFinancialGoal);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message })
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }


}