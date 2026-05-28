import { Request, Response, NextFunction } from 'express';
import { obterUtente } from '../services/patientService';
import { guardarSintoma, listarSintomas } from '../services/sintomaRepository';


export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        const { descricao, gravidade, dataInicioSintoma, tipo } = req.body;

        obterUtente(utenteId);


        if (gravidade === undefined || typeof gravidade !== 'number' || gravidade < 1 || gravidade > 3) {
            const erro: any = new Error('Gravidade é obrigatória e deve ser um número entre 1 e 3');
            erro.status = 400;
            return next(erro);
        }

        if (!descricao || typeof descricao !== 'string') {
            const erro: any = new Error('Descrição é obrigatória e deve ser uma string');
            erro.status = 400;
            return next(erro);
        }

        if (!dataInicioSintoma || typeof dataInicioSintoma !== 'string' || isNaN(Date.parse(dataInicioSintoma))) {
            const erro: any = new Error('Data de início do sintoma é obrigatória e deve ser uma data válida');
            erro.status = 400;
            return next(erro);
        }

        if (!tipo || typeof tipo !== 'string') {
            const erro: any = new Error('Tipo é obrigatório e deve ser uma string');
            erro.status = 400;
            return next(erro);
        }

        
    
        const dataInicio = new Date(dataInicioSintoma);
        
        if (dataInicio < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) || dataInicio > new Date()) {
            const erro: any = new Error('Data de início do sintoma deve ser dentro dos últimos 30 dias');
            erro.status = 400;
            return next(erro);
        }

        guardarSintoma(utenteId, descricao, gravidade, dataInicioSintoma, tipo);


        

        

        res.status(201).json({ message: 'Sintoma submetido com sucesso' });
    } catch (erro) { next(erro); }
}
        

export function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const sintomas = listarSintomas(utenteId);
        res.json(sintomas);     
    }
    catch (erro) { next(erro); }
}   