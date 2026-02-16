import { Request, Response } from 'express';
import * as ordersService from './orders.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../shared/utils/response';

export async function create(req: Request, res: Response) {
  const order = await ordersService.create(req.tenantId!, req.body);
  sendCreated(res, order);
}

export async function findAll(req: Request, res: Response) {
  const { data, total } = await ordersService.findAll(req.tenantId!, req.query as any);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, data, total, page, limit);
}

export async function findById(req: Request, res: Response) {
  const order = await ordersService.findById(req.tenantId!, req.params.id as string);
  sendSuccess(res, order);
}

export async function updateStatus(req: Request, res: Response) {
  const order = await ordersService.updateStatus(req.tenantId!, req.params.id as string, req.body);
  sendSuccess(res, order);
}
