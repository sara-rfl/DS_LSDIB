import { Request, Response, NextFunction } from 'express';
import db from '../config/database';

export function autorizar(...perfisPermitidos: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const utilizador = (req as any).utilizador;

    if (!utilizador) {
      const erro: any = new Error('Não autenticado');
      erro.status = 401;
      return next(erro);
    }

    if (!perfisPermitidos.includes(utilizador.perfil)) {
      const erro: any = new Error('Acesso negado');
      erro.status = 403;
      return next(erro);
    }

    next();
  };
}

// Se o utilizador autenticado for utente, garante que só acede aos seus próprios dados (:id = utenteId)
export function verificarProprioUtente(req: Request, res: Response, next: NextFunction) {
  const utilizador = (req as any).utilizador;
  if (utilizador.perfil !== 'utente') return next();

  const row = db.prepare('SELECT id FROM utente WHERE utilizadorId = ?').get(utilizador.id) as any;
  if (!row || row.id !== Number(req.params.id)) {
    const erro: any = new Error('Acesso negado');
    erro.status = 403;
    return next(erro);
  }
  next();
}
