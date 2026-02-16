import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { CreateOrderDTO, UpdateStatusDTO } from './orders.schema';
import * as notificationService from '../notifications/notifications.service';

/**
 * Crea un pedido nuevo.
 * - Genera ticket incremental por tenant.
 * - Si no se pasa clientId, busca o crea el cliente por teléfono.
 * - Calcula el total automáticamente.
 */
export async function create(tenantId: string, dto: CreateOrderDTO) {
  return prisma.$transaction(async (tx) => {
    // 1. Resolver cliente
    let clientId = dto.clientId;
    if (!clientId) {
      // Buscar cliente existente por teléfono o crear uno nuevo
      let client = await tx.client.findUnique({
        where: { phone_tenantId: { phone: dto.clientPhone!, tenantId } },
      });
      if (!client) {
        client = await tx.client.create({
          data: { name: dto.clientName!, phone: dto.clientPhone!, tenantId },
        });
      }
      clientId = client.id;
    }

    // 2. Incrementar contador de tickets del tenant
    const tenant = await tx.tenant.update({
      where: { id: tenantId },
      data: { ticketCounter: { increment: 1 } },
    });

    // 3. Calcular total
    const totalPrice = dto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    // 4. Crear pedido con sus items
    const order = await tx.order.create({
      data: {
        ticketNumber: tenant.ticketCounter,
        tenantId,
        clientId,
        totalPrice: new Decimal(totalPrice),
        notes: dto.notes,
        estimatedDate: dto.estimatedDate ? new Date(dto.estimatedDate) : null,
        items: {
          create: dto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: new Decimal(item.unitPrice),
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    return order;
  });
}

export async function findAll(
  tenantId: string,
  params: { status?: string; search?: string; page: number; limit: number },
) {
  const where: any = { tenantId };

  if (params.status) {
    where.status = params.status;
  }

  if (params.search) {
    where.OR = [
      { client: { name: { contains: params.search, mode: 'insensitive' } } },
      { client: { phone: { contains: params.search } } },
      { ticketNumber: isNaN(Number(params.search)) ? undefined : Number(params.search) },
    ].filter(Boolean);
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { name: true, phone: true } },
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { data, total };
}

export async function findById(tenantId: string, id: string) {
  const order = await prisma.order.findFirst({
    where: { id, tenantId },
    include: {
      client: true,
      items: true,
    },
  });
  if (!order) throw AppError.notFound('Pedido no encontrado');
  return order;
}

/**
 * Cambia el estado de un pedido.
 * Si pasa a READY, dispara notificación por WhatsApp.
 * Si pasa a DELIVERED, registra fecha de entrega.
 */
export async function updateStatus(tenantId: string, id: string, dto: UpdateStatusDTO) {
  const order = await prisma.order.findFirst({
    where: { id, tenantId },
    include: { client: true },
  });
  if (!order) throw AppError.notFound('Pedido no encontrado');

  const updateData: any = { status: dto.status };

  if (dto.status === 'DELIVERED') {
    updateData.deliveredAt = new Date();
  }

  const updated = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { client: true, items: true },
  });

  // Notificar al cliente cuando está listo
  if (dto.status === 'READY') {
    await notificationService.sendReadyNotification(order.client, order.ticketNumber);
  }

  return updated;
}
