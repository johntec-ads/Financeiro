import { z } from 'zod';
import { CategoryType, TransactionType } from '../types';

export const transactionSchema = z.object({
  type: z.enum(['receita', 'despesa'] as const),
  category: z.custom<CategoryType>(),
  value: z.number()
    .min(0.01, 'Valor deve ser maior que zero')
    .max(999999999.99, 'Valor muito alto'),
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Data inválida'
    }),
  description: z.string()
    .min(3, 'Descrição muito curta')
    .max(100, 'Descrição muito longa')
    .optional(),
  status: z.enum(['pending', 'completed', 'cancelled']),
  tags: z.array(z.string()).optional(),
});

export const userSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email muito curto')
    .max(50, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha muito longa')
    .regex(/[A-Z]/, 'Deve conter letra maiúscula')
    .regex(/[a-z]/, 'Deve conter letra minúscula')
    .regex(/[0-9]/, 'Deve conter número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter caractere especial'),
  firstName: z.string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÿ\s]*$/, 'Nome contém caracteres inválidos'),
  lastName: z.string()
    .min(2, 'Sobrenome muito curto')
    .max(50, 'Sobrenome muito longo')
    .regex(/^[A-Za-zÀ-ÿ\s]*$/, 'Sobrenome contém caracteres inválidos'),
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']),
  currency: z.enum(['BRL', 'USD', 'EUR']),
  language: z.enum(['pt-BR', 'en-US']),
  notifications: z.boolean(),
});

export type ValidationError = {
  path: string[];
  message: string;
};

export const formatValidationErrors = (errors: z.ZodError): ValidationError[] => {
  return errors.errors.map(error => ({
    path: error.path,
    message: error.message
  }));
};
