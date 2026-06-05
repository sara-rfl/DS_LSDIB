import { Router } from "express";
import * as exameController from "../controllers/exameController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar, verificarProprioUtente } from "../middleware/authorizationMiddleware";
import { validateBody } from "../middleware/validateSchema";
import { submeterExameSchema, atualizarExameSchema } from "../../../contracts/schemas";

const router = Router();

router.get('/tipoExame', autenticar, autorizar('medico'), exameController.listarTipos);
router.get('/patients/:id/exame', autenticar, autorizar('medico', 'utente'), verificarProprioUtente, exameController.listar);
router.post('/patients/:id/exame', autenticar, autorizar('medico'), validateBody(submeterExameSchema), exameController.submeter);
router.put('/exame/:exameId', autenticar, autorizar('medico'), validateBody(atualizarExameSchema), exameController.atualizar);
router.delete('/exame/:exameId', autenticar, autorizar('medico'), exameController.eliminar);

export default router;
