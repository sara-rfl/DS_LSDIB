import { Router } from 'express';
import * as userController from '../controllers/userController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { alterarPerfilSchema } from '../../../contracts/schemas';

const router = Router();

router.get('/users', autenticar, autorizar('admin'), userController.listar);
router.delete('/users/:id', autenticar, autorizar('admin'), userController.eliminar);
router.patch('/users/:id/role', autenticar, autorizar('admin'), validateBody(alterarPerfilSchema), userController.alterarPerfil);

export default router;
