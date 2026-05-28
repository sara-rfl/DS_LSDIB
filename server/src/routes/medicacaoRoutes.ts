import { Router } from "express";
import * as medicacaoController from "../controllers/medicacaoController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar } from "../middleware/authorizationMiddleware";

const router = Router();

router.get('/patients/:id/medicacao', autenticar, autorizar('medico', 'utente'), medicacaoController.listar);
router.post('/patients/:id/medicacao', autenticar, autorizar('medico'), medicacaoController.submeter);

export default router;  