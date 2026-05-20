import { Request, Response, NextFunction } from 'express';
import { processarAvaliacao } from '../services/caratService';
import { guardarAvaliacao } from '../services/caratRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { utenteId, respostas } = req.body;
        const resultado = processarAvaliacao(utenteId, respostas);
        guardarAvaliacao(utenteId, resultado.scores, respostas);
        res.status(201).json(resultado);
    } catch (erro) { next(erro); }
}
