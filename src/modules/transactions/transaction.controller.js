import * as transactionService from "./transaction.service.js";
import { transactionFiltersSchema, transactionCreateSchema } from "./transaction.schema.js";
import { ApiError } from "../../utils/api-error.js";

//Endpoint para criaçao da transaction
export const createTransaction = async (req, res) => {
    try {
        const userId = req.user.sub;
        const bodyParsed = transactionCreateSchema.safeParse(req.body);

        if (!bodyParsed.success) {
            return res.status(400).json({
                message: 'Invalid inputs for create a transaction',
                error: bodyParsed.error.flatten().fieldErrors
            });
        }

        const transaction = await transactionService.createTransaction(userId, bodyParsed.data)

        return res.status(201).json(transaction);
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

//Endpoint para getAll transactions
export const getAllTransactions = async (req, res) => {
    const userId = req.user.sub;
    const parsed = transactionFiltersSchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid filters',
            error: parsed.error.flatten().fieldErrors
        });
    }

    const transactions = await transactionService.getAllTransactions(userId, parsed.data);

    return res.status(200).json(transactions);
}

//Endpoint para getById
export const getTransactionById = async (req, res) => {
    const userId = req.user.sub;
    const transactionId = req.params.id;
    const transaction = await transactionService.getTransactionById(userId, transactionId)

    return res.status(200).json(transaction);
}

//Endpoint para DeleteById
export const deleteTransaction = async (req, res) => {
    const userId = req.user.sub;
    const transactionId = req.params.id;
    const transaction = await transactionService.deleteTransaction(userId, transactionId)

    return res.status(200).json(transaction);
}

//Endpoint para retorno de saldo
export const getSummary = async (req, res) => {
    const userId = req.user.sub;
    const balances = await transactionService.getSummary(userId);

    return res.status(200).json(balances);
};

export const getMonthlySummary = async (req, res) => {
    const userId = req.user.sub;

    const balances = await transactionService.getMonthlySummary(userId);

    return res.status(200).json(balances);

}

export const getChartData = async (req, res) => {
    const userId = req.user.sub;

    const balances = await transactionService.getChartData(userId);

    return res.status(200).json(balances);
};

export const getPizzaChart = async (req, res) => {
    const useriId = req.user.sub;

    const data = await transactionService.getPizzaChart(useriId);

    return res.status(200).json(data);
}
