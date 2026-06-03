import { Router } from 'express';
import * as notaController from '../controllers/notaController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { criarNotaSchema } from '../../../contracts/schemas/index';

const router = Router();

router.get('/patients/:id/notas', autenticar, autorizar('medico', 'admin'), notaController.listar);
router.post('/patients/:id/notas', autenticar, autorizar('medico'), validateBody(criarNotaSchema), notaController.submeter);

export default router;
