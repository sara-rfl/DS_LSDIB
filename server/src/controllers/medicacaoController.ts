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
        
        if (!nome || typeof nome !== 'string') {
            const erro: any = new Error('Nome é obrigatório e deve ser uma string');
            erro.status = 400;
            return next(erro);
        }
        
        if (!dose || typeof dose !== 'string') {    
            const erro: any = new Error('Dose é obrigatória e deve ser uma string');
            erro.status = 400;
            return next(erro);
        }
        
        if (!dataInicio || typeof dataInicio !== 'string' || isNaN(Date.parse(dataInicio))) {
            const erro: any = new Error('Data de início é obrigatória e deve ser uma data válida');
            erro.status = 400;
            return next(erro);
        }
        
        if (dataFim && (typeof dataFim !== 'string' || isNaN(Date.parse(dataFim)))) {
            const erro: any = new Error('Data de fim deve ser uma data válida ou nula');
            erro.status = 400;
            return next(erro);
        }
        
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