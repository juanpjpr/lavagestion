import { Request, Response } from 'express';
import * as clientsService from './clients.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../shared/utils/response';

export async function create(req: Request, res: Response) {
  const client = await clientsService.create(req.tenantId!, req.body);
  sendCreated(res, client);
}

export async function findAll(req: Request, res: Response) {
  const { data, total } = await clientsService.findAll(req.tenantId!, req.query as any);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  sendPaginated(res, data, total, page, limit);
}

export async function findById(req: Request, res: Response) {
  const client = await clientsService.findById(req.tenantId!, req.params.id as string);
  sendSuccess(res, client);
}

export async function findByPhone(req: Request, res: Response) {
  const client = await clientsService.findByPhone(req.tenantId!, req.params.phone as string);
  sendSuccess(res, client);
}

export async function update(req: Request, res: Response) {
  const client = await clientsService.update(req.tenantId!, req.params.id as string, req.body);
  sendSuccess(res, client);
}
