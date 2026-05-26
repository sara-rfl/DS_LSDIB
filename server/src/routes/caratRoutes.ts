import { Router } from 'express';
import * as caratController from '../controllers/caratController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.post('/patients/:id/carat', autenticar, autorizar('utente', 'medico'), caratController.submeter);
router.get('/patients/:id/carat', autenticar, autorizar('utente', 'medico', 'admin'), caratController.historico);
router.get('/carat/:evalId', autenticar, autorizar('utente', 'medico', 'admin'), caratController.getAvaliacao);

export default router;
