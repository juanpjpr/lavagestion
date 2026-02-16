import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createOrderSchema, updateStatusSchema, orderQuerySchema } from './orders.schema';
import * as ordersController from './orders.controller';

const router = Router();

router.post('/', validate(createOrderSchema), ordersController.create);
router.get('/', validate(orderQuerySchema, 'query'), ordersController.findAll);
router.get('/:id', ordersController.findById);
router.patch('/:id/status', validate(updateStatusSchema), ordersController.updateStatus);

export default router;
