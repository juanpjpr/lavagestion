import { z } from 'zod';

export const registerSchema = z.object({
  tenantName: z.string().min(2, 'Nombre de la tienda requerido'),
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
  tenantSlug: z.string().min(1, 'Identificador de tienda requerido'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
