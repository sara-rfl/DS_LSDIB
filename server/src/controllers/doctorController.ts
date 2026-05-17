import { Request, Response, NextFunction } from 'express';
import * as doctorService from '../services/doctorService';

export function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(doctorService.listarMedicos());
  } catch (erro) { next(erro); }
}

export function obter(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(doctorService.obterMedico(Number(req.params.id)));
  } catch (erro) { next(erro); }
}

export function criar(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(doctorService.criarMedico(req.body));
  } catch (erro) { next(erro); }
}

export function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(doctorService.atualizarMedico(Number(req.params.id), req.body));
  } catch (erro) { next(erro); }
}

export function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    doctorService.eliminarMedico(Number(req.params.id));
    res.status(204).send();
  } catch (erro) { next(erro); }
}
