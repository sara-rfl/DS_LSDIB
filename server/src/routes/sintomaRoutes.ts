import { Router } from 'express';
import * as sintomaController from '../controllers/sintomaController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar, verificarProprioUtente } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { submeterSintomaSchema } from '../../../contracts/schemas';

const router = Router();

router.get('/patients/:id/sintomas', autenticar, autorizar('utente', 'medico'), verificarProprioUtente, sintomaController.listar);
router.post('/patients/:id/sintomas', autenticar, autorizar('utente', 'medico'), verificarProprioUtente, validateBody(submeterSintomaSchema), sintomaController.submeter);

export default router;
