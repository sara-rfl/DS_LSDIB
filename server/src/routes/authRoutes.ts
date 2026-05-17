import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/auth/login', authController.login);

export default router;
