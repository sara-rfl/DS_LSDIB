import { Router } from 'express';
import * as doctorController from '../controllers/doctorController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import { validateBody } from '../middleware/validateSchema';
import { criarMedicoSchema, atualizarMedicoSchema } from '../../../contracts/schemas';

const router = Router();

router.get('/doctors', autenticar, autorizar('admin'), doctorController.listar);
router.post('/doctors', autenticar, autorizar('admin'), validateBody(criarMedicoSchema), doctorController.criar);
router.get('/doctors/:id', autenticar, autorizar('admin'), doctorController.obter);
router.put('/doctors/:id', autenticar, autorizar('admin'), validateBody(atualizarMedicoSchema), doctorController.atualizar);
router.delete('/doctors/:id', autenticar, autorizar('admin'), doctorController.eliminar);

export default router;
