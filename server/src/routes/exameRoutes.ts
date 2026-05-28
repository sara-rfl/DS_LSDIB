import { Router } from "express";
import * as exameController from "../controllers/exameController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar } from "../middleware/authorizationMiddleware";

const router = Router();

router.get('/patients/:id/exame', autenticar, autorizar('medico', 'utente'), exameController.listar);
router.post('/patients/:id/exame', autenticar, autorizar('medico'), exameController.submeter);

export default router;
