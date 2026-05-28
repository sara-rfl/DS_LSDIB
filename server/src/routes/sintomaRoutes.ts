import { Router } from 'express';
import * as sintomaController from '../controllers/sintomaController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.get('/patients/:id/sintomas', autenticar, autorizar('utente', 'medico'), sintomaController.listar);
router.post('/patients/:id/sintomas', autenticar, autorizar('utente', 'medico'), sintomaController.submeter);

export default router;