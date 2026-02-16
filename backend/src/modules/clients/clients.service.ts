import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { CreateClientDTO, UpdateClientDTO } from './clients.schema';

export async function create(tenantId: string, dto: CreateClientDTO) {
  const existing = await prisma.client.findUnique({
    where: { phone_tenantId: { phone: dto.phone, tenantId } },
  });
  if (existing) {
    throw AppError.conflict('Ya existe un cliente con ese teléfono');
  }

  return prisma.client.create({
    data: { ...dto, tenantId },
  });
}

export async function findAll(
  tenantId: string,
  params: { search?: string; page: number; limit: number },
) {
  const where: any = { tenantId };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { phone: { contains: params.search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.count({ where }),
  ]);

  return { data, total };
}

export async function findById(tenantId: string, id: string) {
  const client = await prisma.client.findFirst({
    where: { id, tenantId },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { items: true },
      },
    },
  });
  if (!client) throw AppError.notFound('Cliente no encontrado');
  return client;
}

export async function findByPhone(tenantId: string, phone: string) {
  return prisma.client.findUnique({
    where: { phone_tenantId: { phone, tenantId } },
  });
}

export async function update(tenantId: string, id: string, dto: UpdateClientDTO) {
  const client = await prisma.client.findFirst({ where: { id, tenantId } });
  if (!client) throw AppError.notFound('Cliente no encontrado');

  return prisma.client.update({
    where: { id },
    data: dto,
  });
}
