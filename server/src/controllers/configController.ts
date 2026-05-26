import { Request, Response, NextFunction } from 'express';
import * as configService from '../services/configService';

export function obter(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(configService.obterConfigs());
  } catch (erro) { next(erro); }
}

export function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { chave, valor } = req.body;
    if (!chave || valor === undefined) {
      const erro: any = new Error('chave e valor são obrigatórios');
      erro.status = 400;
      return next(erro);
    }
    const utilizadorId = (req as any).utilizador.id;
    res.json(configService.atualizarConfig(chave, Number(valor), utilizadorId));
  } catch (erro) { next(erro); }
}
