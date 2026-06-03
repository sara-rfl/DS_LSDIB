import { Router } from 'express';
import * as patientController from '../controllers/patientController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.get('/patients', autenticar, autorizar('medico', 'admin'), patientController.listar);
router.post('/patients', autenticar, autorizar('admin'), patientController.criar); // só admin
router.get('/patients/:id', autenticar, autorizar('medico', 'admin', 'utente'), patientController.obter);
router.put('/patients/:id', autenticar, autorizar('admin'), patientController.atualizar); // só admin
router.delete('/patients/:id', autenticar, autorizar('admin'), patientController.eliminar);

export default router;