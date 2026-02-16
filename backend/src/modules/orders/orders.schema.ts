import { z } from 'zod';

const orderItemSchema = z.object({
  description: z.string().min(1, 'Descripción de prenda requerida'),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0, 'Precio debe ser positivo'),
});

export const createOrderSchema = z.object({
  // Cliente: puede crear nuevo o vincular existente
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(2).optional(),
  clientPhone: z.string().min(8).optional(),
  // Pedido
  items: z.array(orderItemSchema).min(1, 'Al menos una prenda es requerida'),
  notes: z.string().optional(),
  estimatedDate: z.string().datetime().optional(),
}).refine(
  (data) => data.clientId || (data.clientName && data.clientPhone),
  { message: 'Debe proporcionar clientId o nombre + teléfono del cliente' },
);

export const updateStatusSchema = z.object({
  status: z.enum(['RECEIVED', 'WASHING', 'READY', 'DELIVERED']),
});

export const orderQuerySchema = z.object({
  status: z.enum(['RECEIVED', 'WASHING', 'READY', 'DELIVERED']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateStatusDTO = z.infer<typeof updateStatusSchema>;
