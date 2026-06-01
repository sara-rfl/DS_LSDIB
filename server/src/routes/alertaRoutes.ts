import { Router } from "express";
import * as alertaController from "../controllers/alertaController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar } from "../middleware/authorizationMiddleware";
import { validateBody } from "../middleware/validateSchema";
import { atualizarEstadoAlertaSchema, adicionarAcaoAlertaSchema } from "../../../contracts/schemas";

const router = Router();

router.get('/patients/:id/alertas', autenticar, autorizar('medico'), alertaController.listarPorUtente);
router.get('/api/alertas', autenticar, autorizar('medico'), alertaController.listar);
router.get('/api/alertas/:id', autenticar, autorizar('medico'), alertaController.obter);
router.patch('/api/alertas/:id', autenticar, autorizar('medico'), validateBody(atualizarEstadoAlertaSchema), alertaController.atualizarEstado);
router.post('/api/alertas/:id/acoes', autenticar, autorizar('medico'), validateBody(adicionarAcaoAlertaSchema), alertaController.adicionarAcao);

export default router;  