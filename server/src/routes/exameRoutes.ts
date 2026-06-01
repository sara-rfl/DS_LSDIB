import { Router } from "express";
import * as exameController from "../controllers/exameController";
import { autenticar } from "../middleware/authMiddleware";
import { autorizar } from "../middleware/authorizationMiddleware";
import { validateBody } from "../middleware/validateSchema";
import { submeterExameSchema } from "../../../contracts/schemas";

const router = Router();

router.get('/patients/:id/exame', autenticar, autorizar('medico', 'utente'), exameController.listar);
router.post('/patients/:id/exame', autenticar, autorizar('medico'), validateBody(submeterExameSchema), exameController.submeter);

export default router;
