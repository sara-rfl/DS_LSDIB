import { Router } from 'express';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import * as auditController from '../controllers/auditController';

const router = Router();

router.get('/auditoria', autenticar, autorizar('admin'), auditController.listar);
router.delete('/auditoria', autenticar, autorizar('admin'), auditController.limpar);

export default router;
