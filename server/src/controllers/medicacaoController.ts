import { Request, Response, NextFunction } from 'express';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { obterUtente } from '../services/patientService';
import { guardarMedicacao, listarMedicacao, atualizarMedicacao, eliminarMedicacao } from '../repositories/medicacaoRepository';

function validarDatas(dataInicio: string, dataFim?: string | null): string | null {
    if (dataFim && dataFim <= dataInicio) return 'dataFim deve ser posterior a dataInicio';
    return null;
}

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { nome, dose, dataInicio, dataFim } = req.body;

        const erroData = validarDatas(dataInicio, dataFim);
        if (erroData) {
            const erro: any = new Error(erroData);
            erro.status = 400;
            return next(erro);
        }

        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);

        guardarMedicacao(utenteId, medicoId!, nome, dose, dataInicio, dataFim);
        res.status(201).json({ mensagem: 'Medicação submetido com sucesso' });
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

export function atualizar(req: Request, res: Response, next: NextFunction) {
    try {
        const medicacaoId = Number(req.params.medicacaoId);
        const { nome, dose, dataInicio, dataFim } = req.body;

        const erroData = validarDatas(dataInicio, dataFim);
        if (erroData) {
            const erro: any = new Error(erroData);
            erro.status = 400;
            return next(erro);
        }

        atualizarMedicacao(medicacaoId, nome, dose, dataInicio, dataFim ?? null);
        res.json({ mensagem: 'Medicação atualizada com sucesso' });
    } catch (erro) { next(erro); }
}

export function eliminar(req: Request, res: Response, next: NextFunction) {
    try {
        const medicacaoId = Number(req.params.medicacaoId);
        eliminarMedicacao(medicacaoId);
        res.status(204).send();
    } catch (erro) { next(erro); }
}
