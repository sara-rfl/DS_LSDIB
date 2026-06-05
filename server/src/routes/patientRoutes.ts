import { Router } from 'express';
import * as patientController from '../controllers/patientController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar, verificarProprioUtente } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { criarUtenteSchema, atualizarUtenteSchema } from '../../../contracts/schemas';

const router = Router();

router.get('/patients', autenticar, autorizar('medico', 'admin'), patientController.listar);
router.post('/patients', autenticar, autorizar('admin'), validateBody(criarUtenteSchema), patientController.criar);
router.get('/patients/:id', autenticar, autorizar('medico', 'admin', 'utente'), verificarProprioUtente, patientController.obter);
router.put('/patients/:id', autenticar, autorizar('admin'), validateBody(atualizarUtenteSchema), patientController.atualizar);
router.delete('/patients/:id', autenticar, autorizar('admin'), patientController.eliminar);

export default router;