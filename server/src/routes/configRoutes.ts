import { Router } from 'express';
import * as configController from '../controllers/configController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { atualizarConfigSchema } from '../../../contracts/schemas';

const router = Router();

router.get('/config', autenticar, autorizar('admin'), configController.obter);
router.put('/config', autenticar, autorizar('admin'), validateBody(atualizarConfigSchema), configController.atualizar);

export default router;
