import { Request, Response, NextFunction } from 'express';
import { obterUtente } from '../services/patientService';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { guardarExame, listarExames, tipoExameExiste, atualizarExame, eliminarExame, listarTiposExame } from '../repositories/exameRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { tipoExameId, data, resultado, observacoes } = req.body;
        const tipoExameIdNum = Number(tipoExameId);
        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);

        if (!tipoExameExiste(tipoExameIdNum)) {
            const erro: any = new Error('O Id do tipo de exame deve existir');
            erro.status = 404;
            return next(erro);
        }

        guardarExame(utenteId, medicoId!, tipoExameIdNum, data, resultado ?? null, observacoes ?? null);
        res.status(201).json({ message: 'Exame submetido com sucesso' });
    } catch (erro) { next(erro); }
}


export function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const exames = listarExames(utenteId);
        res.json(exames);
    } catch (erro) { next(erro); }
}

export function atualizar(req: Request, res: Response, next: NextFunction) {
    try {
        const exameId = Number(req.params.exameId);
        const { resultado, observacoes } = req.body;
        atualizarExame(exameId, resultado, observacoes ?? null);
        res.json({ message: 'Exame atualizado com sucesso' });
    } catch (erro) { next(erro); }
}

export function eliminar(req: Request, res: Response, next: NextFunction) {
    try {
        const exameId = Number(req.params.exameId);
        eliminarExame(exameId);
        res.status(204).send();
    } catch (erro) { next(erro); }
}

export function listarTipos(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(listarTiposExame());
    } catch (erro) { next(erro); }
}
