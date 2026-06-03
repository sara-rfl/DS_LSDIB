import { Router } from 'express';
import * as doctorController from '../controllers/doctorController';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';

const router = Router();

router.get('/doctors', autenticar, autorizar('admin'), doctorController.listar);
router.post('/doctors', autenticar, autorizar('admin'), doctorController.criar);
router.get('/doctors/:id', autenticar, autorizar('admin'), doctorController.obter);
router.put('/doctors/:id', autenticar, autorizar('admin'), doctorController.atualizar);
router.delete('/doctors/:id', autenticar, autorizar('admin'), doctorController.eliminar);

export default router;
