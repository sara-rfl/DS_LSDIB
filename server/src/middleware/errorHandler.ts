import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  //err.status || 500 — usa o código de erro que veio (ex: 401, 404) ou 500 se não tiver nenhum
  const message = err.message || 'Erro interno do servidor';

  console.error(`[ERRO] ${req.method} ${req.path} → ${status}: ${message}`);
//escreve o erro no terminal (para diagnóstico)
  res.status(status).json({ erro: message });
//responde ao cliente com o erro em formato JSON
}
