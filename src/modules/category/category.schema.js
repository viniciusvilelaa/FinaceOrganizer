import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  color: z
    .string()
    .trim()
    .min(1, "Color is required"),
});

export const updateCategorySchema = createCategorySchema.partial();