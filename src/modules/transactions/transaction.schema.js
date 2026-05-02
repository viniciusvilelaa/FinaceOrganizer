import {z} from 'zod';

export const transactionFiltersSchema = z.object({
    category: z.enum(['LAZER', 'COMIDA', 'TRANSPORTE']).optional(),
    description: z.string().min(1).optional(),
    period: z.enum(['30d', '3m', '1y']).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional()
});