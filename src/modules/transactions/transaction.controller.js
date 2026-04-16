import * as transactionService from "./transaction.service.js"

//Endpoint para criaçao da transaction
export const createTransaction = async (req, res) => {
    const userId = req.user.sub;
    const transaction = await transactionService.createTransaction(userId, req.body);
    return res.status(201).json(transaction);
}

//Endpoint para getAll transactions
export const getAllTransactions = async (req, res) => {
  const userId = req.user.sub;
  const transactions = await transactionService.getAllTransactions(userId);

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