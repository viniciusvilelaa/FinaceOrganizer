import { z } from 'zod';

export const CreateTransactionSchema = z.object({
    amount: z.coerce.int({required_error: 'Amount is required'}),
    type: z.enum(['INCOME', 'EXPENSE'], {required_error: "Type is required"}),
    category: z.enum(['COMIDA', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 'MORADIA', 'OUTROS', 'INVESTIMENTO', 'SALARIO', 'ASSINATURAS', 'COMBUSTIVEL']),
    description: z.string({required_error: 'Description is required'}).min(1)
})

export const transactionFiltersSchema = z.object({
    category: z.enum(['LAZER', 'COMIDA', 'TRANSPORTE']).optional(),
    description: z.string().min(1).optional(),
    period: z.enum(['30d', '3m', '1y']).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    page: z.string().optional(),
    limit: z.string().optional()
});