import * as transactionController from "./transaction.controller.js"
import express from "express"
import { authMiddleware } from "../../middlewares/auth.middleware.js"
import { asyncHandler } from "../../utils/async-handler.js"

//Configurando config padrao para rotas
const transactionRouter = express.Router();
transactionRouter.use(authMiddleware);

//Config dos endpoints
transactionRouter.get("/", asyncHandler(transactionController.getAllTransactions));
transactionRouter.get("/:id", asyncHandler(transactionController.getTransactionById));
transactionRouter.post("/", asyncHandler(transactionController.createTransaction));
transactionRouter.delete("/:id", asyncHandler(transactionController.deleteTransaction));

export { transactionRouter }