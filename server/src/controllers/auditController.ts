import { Request, Response, NextFunction } from 'express';
import * as auditService from '../services/auditService';

export function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const limite = Number(req.query.limite) || 200;
    const registos = auditService.listar(limite);
    res.json(registos);
  } catch (erro) { next(erro); }
}

export function limpar(req: Request, res: Response, next: NextFunction) {
  try {
    auditService.limpar();
    res.json({ mensagem: 'Registos apagados com sucesso.' });
  } catch (erro) { next(erro); }
}
