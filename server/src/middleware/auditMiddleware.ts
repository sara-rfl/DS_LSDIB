import { Request, Response, NextFunction } from 'express';
import * as auditService from '../services/auditService';

export function auditar(req: Request, res: Response, next: NextFunction) {
  const utilizador = (req as any).utilizador;
  const ip = req.ip ?? req.socket.remoteAddress ?? 'desconhecido';

  res.on('finish', () => {
    auditService.registar({
      utilizadorId: utilizador?.id,
      nome:         utilizador?.nome,
      perfil:       utilizador?.perfil,
      metodo:       req.method,
      recurso:      req.originalUrl,
      ip,
    });
  });

  next();
}
