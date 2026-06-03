import { Router } from 'express';
import * as userController from '../controllers/userController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.get('/users', autenticar, autorizar('admin'), userController.listar);
router.delete('/users/:id', autenticar, autorizar('admin'), userController.eliminar);
router.patch('/users/:id/role', autenticar, autorizar('admin'), userController.alterarPerfil);

export default router;
