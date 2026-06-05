import { Router } from 'express';
import * as caratController from '../controllers/caratController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar, verificarProprioUtente } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { submeterCaratSchema } from '../../../contracts/schemas';

const router = Router();

router.post('/patients/:id/carat', autenticar, autorizar('utente'), verificarProprioUtente, validateBody(submeterCaratSchema), caratController.submeter);
router.get('/patients/:id/carat', autenticar, autorizar('utente', 'medico', 'admin'), verificarProprioUtente, caratController.historico);
router.get('/carat/:evalId', autenticar, autorizar('utente', 'medico', 'admin'), caratController.getAvaliacao);

export default router;
