import { z } from "zod";

const currentDate = new Date().getFullYear();

export const financialGoalsSchema = z.object({
    targetAmount: z.number({ required_error: 'Target amount is required' })
        .positive({ message: 'Target amount must be positive' }),

    month: z.number({ required_error: 'Month is required' })
        .int("Month must be an integer")
        .min(1, "Month must be at least 1")
        .max(12, "Month must be at most 12"),

    year: z.number({ required_error: 'Year is required' })
        .int("Year must be an integer")
        .min(currentDate, "Year cannot be in the past")


})