import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const erro: any = new Error('Email e password são obrigatórios');
      erro.status = 400;
      return next(erro);
    }

    const resultado = authService.login(email, password);
    res.json(resultado);

  } catch (erro) {
    next(erro);
  }
}
