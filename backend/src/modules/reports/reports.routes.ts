import { Router } from 'express';
import * as reportsController from './reports.controller';

const router = Router();

router.get('/daily', reportsController.getDailyReport);
router.get('/weekly', reportsController.getWeeklyReport);

export default router;
