import { Request, Response, NextFunction } from 'express';
import { obterUtente } from '../services/patientService';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { guardarExame, listarExames, tipoExameExiste } from '../services/exameRepository';

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

        guardarExame(utenteId, medicoId!, tipoExameIdNum, data, resultado, observacoes);
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
