import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../shared/errors/AppError';

interface JwtPayload {
  userId: string;
  tenantId: string;
  role: 'OWNER' | 'EMPLOYEE';
}

/**
 * Middleware de autenticación.
 * Extrae el JWT del header Authorization, lo verifica y
 * inyecta userId, tenantId y userRole en el request.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw AppError.unauthorized('Token no proporcionado');
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.userId = payload.userId;
    req.tenantId = payload.tenantId;
    req.userRole = payload.role;
    next();
  } catch {
    throw AppError.unauthorized('Token inválido o expirado');
  }
}

/**
 * Middleware que requiere rol OWNER.
 * Debe usarse DESPUÉS de authenticate.
 */
export function requireOwner(req: Request, _res: Response, next: NextFunction) {
  if (req.userRole !== 'OWNER') {
    throw AppError.forbidden('Solo el dueño puede realizar esta acción');
  }
  next();
}
