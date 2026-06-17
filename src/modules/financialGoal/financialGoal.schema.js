import { z } from "zod";

const currentDate = new Date().getFullYear();

export const financialGoalSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).max(15, "Name must be at most 15 characters"),

    targetAmount: z.number({ required_error: 'Target amount is required' })
        .positive({ message: 'Target amount must be positive' }),

    month: z.number({ required_error: 'Month is required' })
        .int("Month must be an integer")
        .min(1, "Month must be at least 1")
        .max(12, "Month must be at most 12"),

    year: z.number({ required_error: 'Year is required' })
        .int("Year must be an integer")
        .min(currentDate, "Year cannot be in the past")
});

export const updateFinancialGoalSchema = z.object({
    name: z.string().max(15, "Name must be at most 15 characters").optional(),
    targetAmount: z.number().positive({ message: 'Target amount must be positive' }).optional()
}).refine(data => data.name !== undefined || data.targetAmount !== undefined, {
    message: "At least one field (name or targetAmount) must be provided for update"
});

export const goalParamsSchema = z.object({
    goalId: z.coerce.number().int().positive()
});

export const goalFiltersSchema = z.object({
    status: z.enum(['ACHIEVED', 'FAILED', "IN_PROGRESS"]).optional(),
    month: z.number().int("Month must be an integer").min(1, "Month must be at least 1").max(12, "Month must be at most 12").optional(),
    year: z.number().int("Year must be an integer").optional(),
    page: z.string().optional(),
    limit: z.string().optional()
})