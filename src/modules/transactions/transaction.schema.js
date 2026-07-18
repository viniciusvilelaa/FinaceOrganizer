import { z } from 'zod';
const categories = [
  'COMIDA', 'TRANSPORTE', 'LAZER', 'SAUDE', 'EDUCACAO', 
  'MORADIA', 'OUTROS', 'INVESTIMENTO', 'SALARIO', 'ASSINATURA', 'COMBUSTIVEL'
];

export const transactionCreateSchema = z.object({
    amount: z.coerce.number({required_error: 'Amount is required'}),
    type: z.enum(['INCOME', 'EXPENSE'], {required_error: "Type is required"}),
    category: z.coerce.number({required_error: 'Transaction Category is required'}),
    description: z.string({required_error: 'Description is required'}).min(1),
    date: z.coerce.date({required_error: 'Date is required'})
})

export const transactionFiltersSchema = z.object({
    category: z.enum(categories).optional(),
    description: z.string().min(1).optional(),
    period: z.enum(['30d', '3m', '1y']).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional()
});