import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  sendCreated(res, result);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  sendSuccess(res, result);
}

export async function me(req: Request, res: Response) {
  // El middleware de auth ya inyectó los datos
  sendSuccess(res, {
    userId: req.userId,
    tenantId: req.tenantId,
    role: req.userRole,
  });
}
