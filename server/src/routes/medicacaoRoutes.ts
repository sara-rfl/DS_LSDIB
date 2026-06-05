import { Router } from "express";
import * as medicacaoController from "../controllers/medicacaoController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar, verificarProprioUtente } from "../middleware/authorizationMiddleware";
import { validateBody } from "../middleware/validateSchema";
import { submeterMedicacaoSchema } from "../../../contracts/schemas";

const router = Router();

router.get('/patients/:id/medicacao', autenticar, autorizar('medico', 'utente'), verificarProprioUtente, medicacaoController.listar);
router.post('/patients/:id/medicacao', autenticar, autorizar('medico'), validateBody(submeterMedicacaoSchema), medicacaoController.submeter);
router.put('/medicacao/:medicacaoId', autenticar, autorizar('medico'), validateBody(submeterMedicacaoSchema), medicacaoController.atualizar);
router.delete('/medicacao/:medicacaoId', autenticar, autorizar('medico'), medicacaoController.eliminar);

export default router;
