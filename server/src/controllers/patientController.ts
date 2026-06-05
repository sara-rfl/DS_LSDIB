import { Request, Response, NextFunction } from 'express';
import * as patientService from '../services/patientService';

export function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const utentes = patientService.listarUtentes();
    res.json(utentes);
  } catch (erro) { next(erro); }
}

export function obter(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(patientService.obterUtente(Number(req.params.id)));
  } catch (erro) { next(erro); }
}

export function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const utente = patientService.criarUtente(req.body);
    res.status(201).json(utente);
  } catch (erro) { next(erro); }
}

export function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const utente = patientService.atualizarUtente(Number(req.params.id), req.body);
    res.json(utente);
  } catch (erro) { next(erro); }
}

export function eliminar(req: Request, res: Response, next: NextFunction) {
  try {
    patientService.eliminarUtente(Number(req.params.id));
    res.status(204).send();
  } catch (erro) { next(erro); }
}
