import {z} from 'zod';

export const transactionFiltersSchema = z.object({
    category: z.enum(['LAZER', 'COMIDA', 'TRANSPORTE']).optional(),
    description: z.string().min(1).optional(),
    period: z.enum(['30 days', '3 month', '1 year']).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    page: z.string().optional(),
    limit: z.string().optional()
});