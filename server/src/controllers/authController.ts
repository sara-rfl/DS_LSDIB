import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const resultado = authService.login(email, password);
    res.json(resultado);
  } catch (erro) {
    next(erro);
  }
}
