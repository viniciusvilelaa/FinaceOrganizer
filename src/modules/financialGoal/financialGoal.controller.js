import * as financialService from "./financialGoal.service";
import { financialGoalSchema } from "./financialGoal.schema";

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

        const financialGoal = await financialService.createFinancialGoal(userId, bodyParsed.data);

        return res.status(201).json(financialGoal);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }


}