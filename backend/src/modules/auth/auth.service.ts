import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { RegisterDTO, LoginDTO } from './auth.schema';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function signToken(userId: string, tenantId: string, role: string): string {
  return jwt.sign({ userId, tenantId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);
}

/**
 * Registra un nuevo tenant + usuario owner.
 * Se usa al crear una nueva tintorería en el sistema.
 */
export async function register(dto: RegisterDTO) {
  const slug = generateSlug(dto.tenantName);

  const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
  if (existingTenant) {
    throw AppError.conflict('Ya existe una tienda con un nombre similar');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name: dto.tenantName, slug },
    });

    const user = await tx.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'OWNER',
        tenantId: tenant.id,
      },
    });

    return { tenant, user };
  });

  const token = signToken(result.user.id, result.tenant.id, result.user.role);

  return {
    token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
    tenant: {
      id: result.tenant.id,
      name: result.tenant.name,
      slug: result.tenant.slug,
    },
  };
}

/**
 * Login de un usuario existente.
 * Requiere slug del tenant para soportar multi-tenant.
 */
export async function login(dto: LoginDTO) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: dto.tenantSlug },
  });
  if (!tenant || !tenant.isActive) {
    throw AppError.unauthorized('Tienda no encontrada');
  }

  const user = await prisma.user.findUnique({
    where: { email_tenantId: { email: dto.email, tenantId: tenant.id } },
  });
  if (!user || !user.isActive) {
    throw AppError.unauthorized('Credenciales inválidas');
  }

  const validPassword = await bcrypt.compare(dto.password, user.password);
  if (!validPassword) {
    throw AppError.unauthorized('Credenciales inválidas');
  }

  const token = signToken(user.id, tenant.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },
  };
}
