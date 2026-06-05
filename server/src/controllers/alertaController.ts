import { Request, Response, NextFunction } from 'express';
import { listarAlertas, getAlertaPorId, atualizarEstadoAlerta, adicionarAcaoAlerta, guardarAlerta, listarAcoesAlerta } from '../repositories/alertaRepository';
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
    try {
        const alerta = getAlertaPorId(Number(req.params.id));
        if (!alerta) {
            const erro: any = new Error('Alerta não encontrado');
            erro.status = 404;
            return next(erro);
        }
        res.json(alerta);
    }
    catch (erro) { next(erro); }
}

export function atualizarEstado(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { novoEstado } = req.body;

    try {
        const alerta = getAlertaPorId(Number(id)) as any;
        if (!alerta) {
            const erro: any = new Error('Alerta não encontrado');
            erro.status = 404;
            return next(erro);
        }

        if (alerta.estado === 'Fechado' && novoEstado === 'Novo') {
            const erro: any = new Error('Não é possível reabrir um alerta fechado como Novo.');
            erro.status = 400;
            return next(erro);
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
            const erro: any = new Error('Alerta não encontrado');
            erro.status = 404;
            return next(erro);
        }
        adicionarAcaoAlerta(Number(id), medicoId!, descricao);
        res.json({ mensagem: 'Ação adicionada' });
    }
    catch (erro) { next(erro); }
}

export function listarPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
        const medicoId = Number(req.params.id);
        const alertas = listarAlertas({ medicoId });
        res.json(alertas);
    } catch (erro) { next(erro); }
}

export function criarPedidoCarat(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);

        obterUtente(utenteId);

        guardarAlerta({
            utenteId,
            medicoId,
            avaliacaoCaratId: null,
            tipo: 'PEDIDO_CARAT',
            prioridade: 2,
            motivo: 'O seu médico solicita o preenchimento do questionário CARAT.'
        });
        res.status(201).json({ mensagem: 'Pedido de avaliação CARAT criado.' });
    } catch (erro) { next(erro); }
}

export function verificarPedidoCarat(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        const pendentes = listarAlertas({ utenteId, tipo: 'PEDIDO_CARAT', estado: 'Novo' });
        res.json({ temPedido: pendentes.length > 0 });
    } catch (erro) { next(erro); }
}

export function listarAcoes(req: Request, res: Response, next: NextFunction) {
    try {
        const alertaId = Number(req.params.id);
        const alerta = getAlertaPorId(alertaId);
        if (!alerta) {
            const erro: any = new Error('Alerta não encontrado');
            erro.status = 404;
            return next(erro);
        }
        res.json(listarAcoesAlerta(alertaId));
    } catch (erro) { next(erro); }
}
