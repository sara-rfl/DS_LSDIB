import { Router } from "express";
import * as alertaController from "../controllers/alertaController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar, verificarProprioUtente } from "../middleware/authorizationMiddleware";
import { validateBody } from "../middleware/validateSchema";
import { atualizarEstadoAlertaSchema, adicionarAcaoAlertaSchema } from "../../../contracts/schemas";

const router = Router();

router.get('/patients/:id/alertas', autenticar, autorizar('medico'), alertaController.listarPorUtente);
router.get('/api/alertas', autenticar, autorizar('medico'), alertaController.listar);
router.get('/api/alertas/:id', autenticar, autorizar('medico'), alertaController.obter);
router.get('/doctors/:id/alerts', autenticar, autorizar('medico', 'admin'), alertaController.listarPorMedico);
router.patch('/api/alertas/:id', autenticar, autorizar('medico'), validateBody(atualizarEstadoAlertaSchema), alertaController.atualizarEstado);
router.get('/api/alertas/:id/acoes', autenticar, autorizar('medico'), alertaController.listarAcoes);
router.post('/api/alertas/:id/acoes', autenticar, autorizar('medico'), validateBody(adicionarAcaoAlertaSchema), alertaController.adicionarAcao);
router.post('/patients/:id/pedido-carat', autenticar, autorizar('medico'), alertaController.criarPedidoCarat);
router.get('/patients/:id/pedido-carat', autenticar, autorizar('utente'), verificarProprioUtente, alertaController.verificarPedidoCarat);

export default router;
