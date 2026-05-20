import { Router } from 'express';
import * as caratController from '../controllers/caratController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.post('/api/carat/avaliacoes', autenticar, autorizar('utente', 'medico'), caratController.submeter);

export default router;
