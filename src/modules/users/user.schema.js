import { z } from 'zod';

export const userCreateSchema = z.object({
  name: z
    .string({ required_error: 'User name is required' })
    .trim()
    .min(3, "Name must have at least 3 characters") // Corrigido erro de digitação 'leat'
    .max(60, "Name must be at most 60 characters"),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must have at least 6 characters')
    .max(100, "Password must be at most 100 characters") // Corrigido erro de digitação 'Password be'
});

// [NOVO] Adicionado para validar as entradas do login
export const userLoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});
