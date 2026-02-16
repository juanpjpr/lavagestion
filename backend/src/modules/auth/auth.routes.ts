import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';
import { registerSchema, loginSchema } from './auth.schema';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
