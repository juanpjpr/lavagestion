import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateClientDTO = z.infer<typeof createClientSchema>;
export type UpdateClientDTO = z.infer<typeof updateClientSchema>;
