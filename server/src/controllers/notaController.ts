import { Request, Response, NextFunction } from 'express';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { obterUtente } from '../services/patientService';
import { guardarNota, listarNotas } from '../repositories/notaRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        const { titulo, conteudo } = req.body;
        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);

        obterUtente(utenteId);

        guardarNota(utenteId, medicoId!, titulo ?? null, conteudo);
        res.status(201).json({ message: 'Nota clínica registada com sucesso' });
    } catch (erro) { next(erro); }
}

export function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const notas = listarNotas(utenteId);
        res.json(notas);
    } catch (erro) { next(erro); }
}
