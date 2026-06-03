import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(userService.listarTodos());
  } catch (erro) { next(erro); }
}

export function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    userService.eliminar(Number(req.params.id));
    res.status(204).send();
  } catch (erro) { next(erro); }
}

export function alterarPerfil(req: Request, res: Response, next: NextFunction) {
  try {
    const { perfil } = req.body;
    if (!perfil) {
      const erro: any = new Error('perfil é obrigatório');
      erro.status = 400;
      return next(erro);
    }
    res.json(userService.alterarPerfil(Number(req.params.id), perfil));
  } catch (erro) { next(erro); }
}
