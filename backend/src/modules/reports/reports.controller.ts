import { Request, Response } from 'express';
import * as reportsService from './reports.service';
import { sendSuccess } from '../../shared/utils/response';

export async function getDailyReport(req: Request, res: Response) {
  const date = req.query.date as string | undefined;
  const report = await reportsService.getDailyReport(req.tenantId!, date);
  sendSuccess(res, report);
}

export async function getWeeklyReport(req: Request, res: Response) {
  const report = await reportsService.getWeeklyReport(req.tenantId!);
  sendSuccess(res, report);
}
