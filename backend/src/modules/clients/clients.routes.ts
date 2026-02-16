import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { createClientSchema, updateClientSchema, clientQuerySchema } from './clients.schema';
import * as clientsController from './clients.controller';

const router = Router();

router.post('/', validate(createClientSchema), clientsController.create);
router.get('/', validate(clientQuerySchema, 'query'), clientsController.findAll);
router.get('/phone/:phone', clientsController.findByPhone);
router.get('/:id', clientsController.findById);
router.patch('/:id', validate(updateClientSchema), clientsController.update);

export default router;
