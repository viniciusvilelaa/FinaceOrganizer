import * as financialGoalController from "./financialGoal.controller.js"
import express from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../utils/async-handler.js"

const financialGoalRouter = express.Router();
financialGoalRouter.use(authMiddleware);

//Configurando endpoints
financialGoalRouter.post("/", asyncHandler(financialGoalController.createFinancialGoal));
financialGoalRouter.get("/history", asyncHandler(financialGoalController.getHistoryGoal));
financialGoalRouter.get("/current", asyncHandler(financialGoalController.getCurrentGoal));




export { financialGoalRouter }