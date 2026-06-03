import { Router, Request, Response, NextFunction } from 'express';
import { autenticar } from '../middleware/authMiddleware';
import { autorizar } from '../middleware/authorizationMiddleware';
import * as fhirService from '../services/fhirService';

const router = Router();

router.get(
    '/fhir/Patient',
    autenticar,
    autorizar('medico', 'admin'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const bundle = fhirService.getFHIRPatientBundle();
            res.json(bundle);
        } catch (erro) { next(erro); }
    }
);

router.get(
    '/fhir/Patient/:id',
    autenticar,
    autorizar('medico', 'admin'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const patient = fhirService.getFHIRPatient(Number(req.params.id));
            res.json(patient);
        } catch (erro) { next(erro); }
    }
);

router.get(
    '/fhir/Observation/:id',
    autenticar,
    autorizar('medico', 'admin'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const observation = fhirService.getFHIRObservation(Number(req.params.id));
            res.json(observation);
        } catch (erro) { next(erro); }
    }
);

router.get(
    '/fhir/Patient/:id/Observation',
    autenticar,
    autorizar('medico', 'admin'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const bundle = fhirService.getFHIRObservationBundle(Number(req.params.id));
            res.json(bundle);
        } catch (erro) { next(erro); }
    }
);

export default router;