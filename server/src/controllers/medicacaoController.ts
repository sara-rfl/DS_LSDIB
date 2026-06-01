import { Request, Response, NextFunction } from 'express';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { obterUtente } from '../services/patientService';
import { guardarMedicacao, listarMedicacao } from '../services/medicacaoRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { nome, dose, dataInicio, dataFim } = req.body;
        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);

        guardarMedicacao(utenteId, medicoId!, nome, dose, dataInicio, dataFim);
        res.status(201).json({ message: 'Medicação submetido com sucesso' });
    } catch (erro) { next(erro); }
}

export function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const medicacao = listarMedicacao(utenteId);
        res.json(medicacao);
    } catch (erro) { next(erro); }
}
