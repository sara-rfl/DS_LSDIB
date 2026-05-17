import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  const agora = new Date().toISOString();
  //a hora actual em formato legível (ex: 2026-05-17T10:23:00.000Z)
  console.log(`[${agora}] ${req.method} ${req.path}`);
  //escreve no terminal: [2026-05-17T10:23:00.000Z] GET /patients
  next();
  //obrigatório — diz ao Express "acabei, passa para o próximo middleware"
}
