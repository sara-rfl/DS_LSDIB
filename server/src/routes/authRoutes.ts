import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateBody } from '../middleware/validateSchema';
import { loginSchema } from '../../../contracts/schemas';

const router = Router();

router.post('/auth/login', validateBody(loginSchema), authController.login);

export default router;
