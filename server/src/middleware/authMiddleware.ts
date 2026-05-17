import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const erro: any = new Error('Token em falta');
    erro.status = 401;
    return next(erro);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (req as any).utilizador = payload;
    next();
  } catch {
    const erro: any = new Error('Token inválido ou expirado');
    erro.status = 401;
    next(erro);
  }
}
