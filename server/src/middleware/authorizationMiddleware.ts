import { Request, Response, NextFunction } from 'express';

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
