import { Router } from 'express';
import * as configController from '../controllers/configController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.get('/config', autenticar, autorizar('admin'), configController.obter);
router.put('/config', autenticar, autorizar('admin'), configController.atualizar);

export default router;
