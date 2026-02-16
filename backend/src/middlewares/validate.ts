import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware genérico de validación con Zod.
 * Valida body, query o params según se indique.
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    req[source] = schema.parse(req[source]);
    next();
  };
}
