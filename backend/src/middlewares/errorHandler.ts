import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Errores de validación (Zod)
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ ok: false, message: 'Datos inválidos', errors });
  }

  // Errores de negocio controlados
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ ok: false, message: err.message });
  }

  // Error no controlado
  console.error('Error no controlado:', err);
  return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
}
