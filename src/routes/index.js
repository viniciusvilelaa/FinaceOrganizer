import { Router } from "express";
import { healthRouter } from "./health.routes.js";
import { userRouter } from "../modules/users/user.routes.js";
import { transactionRouter } from "../modules/transactions/transaction.routes.js";
import { financialGoalRouter } from "../modules/financialGoal/financialGoal.routes.js";


const router = Router();

router.use("/health", healthRouter);
router.use("/users", userRouter);
router.use("/transactions", transactionRouter);
router.use("/goals", financialGoalRouter);

export { router };
