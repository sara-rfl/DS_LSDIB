import { Request, Response, NextFunction } from 'express';
import { listarAlertas, getAlertaPorId, atualizarEstadoAlerta, adicionarAcaoAlerta } from '../services/alertaRepository';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService'
import { obterUtente } from '../services/patientService';

export function listar (req: Request, res: Response, next: NextFunction) {
    const { utenteId, medicoId, estado } = req.query;

    try {
        const filtros: { utenteId?: number; medicoId?: number; estado?: string } = {};
        if (utenteId) filtros.utenteId = parseInt(utenteId as string);
        if (medicoId) filtros.medicoId = parseInt(medicoId as string);
        if (estado) filtros.estado = estado as string;

        const alertas = listarAlertas(filtros);
        res.json(alertas);
    }
    catch (erro) { next(erro); }
}

export function obter (req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
        const alertas = getAlertaPorId(parseInt(id as string));
        if (!alertas) {
            res.status(404).json({ message: 'Alerta não encontrado' });
            return;
        }
        res.json(alertas);
    }
    catch (erro) { next(erro); }
}

export function atualizarEstado(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { novoEstado } = req.body;

    try {
        const alerta = getAlertaPorId(Number(id));
        if (!alerta) {
            res.status(404).json({ message: 'Alerta não encontrado' });
            return;
        }
        atualizarEstadoAlerta(Number(id), novoEstado);
        res.json({ mensagem: 'Estado atualizado' });
    }
    catch (erro) { next(erro); }
}

export function listarPorUtente(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const alertas = listarAlertas({ utenteId });
        res.json(alertas);
    } catch (erro) { next(erro); }
}


export function adicionarAcao(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const utilizadorId = (req as any).utilizador.id;
    const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);
    const { descricao } = req.body;

    try {
        const alerta = getAlertaPorId(Number(id));
        if (!alerta) {
            res.status(404).json({ message: 'Alerta não encontrado' });
            return;
        }
        adicionarAcaoAlerta(Number(id), medicoId!, descricao);
        res.json({ mensagem: 'Ação adicionada' });
    }
    catch (erro) { next(erro); }
}
