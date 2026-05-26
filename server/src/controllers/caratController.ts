import { Request, Response, NextFunction } from 'express';
import { processarAvaliacao } from '../services/caratService';
import { guardarAvaliacao, getHistorico, getAvaliacaoById } from '../services/caratRepository';
import { gerarAlertas } from '../services/alertaEngine';
import { guardarAlerta, getMedicoDoUtente, temMedicacaoAtiva } from '../services/alertaRepository';
import { obterUtente } from '../services/patientService';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        const { respostas } = req.body;

        obterUtente(utenteId);

        if (
            !Array.isArray(respostas) ||
            respostas.length !== 10 ||
            respostas.some((v: any) => !Number.isInteger(v) || v < 0 || v > 3)
        ) {
            const erro: any = new Error('Respostas inválidas: são necessários 10 valores inteiros entre 0 e 3');
            erro.status = 400;
            return next(erro);
        }

        const resultado = processarAvaliacao(utenteId, respostas);
        const avaliacaoCaratId = guardarAvaliacao(utenteId, resultado.scores, respostas);
        const medicoId = getMedicoDoUtente(utenteId);
        const temMedicacao = temMedicacaoAtiva(utenteId);
        const contexto = {
            scores: resultado.scores,
            interpretacao: resultado.interpretacao,
            deteriorou: resultado.deteriorou,
            temMedicacaoAtiva: temMedicacao
        };
        const alertas = gerarAlertas(contexto, utenteId, medicoId, Number(avaliacaoCaratId));
        alertas.forEach(alerta => guardarAlerta(alerta));
        res.status(201).json({ ...resultado, alertasGerados: alertas });
    } catch (erro) { next(erro); }
}

export function historico(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const avaliacoes = getHistorico(utenteId);
        res.json(avaliacoes);
    } catch (erro) { next(erro); }
}

export function getAvaliacao(req: Request, res: Response, next: NextFunction) {
    try {
        const avaliacaoId = Number(req.params.evalId);
        const avaliacao = getAvaliacaoById(avaliacaoId);
        if (!avaliacao) {
            const erro: any = new Error('Avaliação não encontrada');
            erro.status = 404;
            return next(erro);
        }
        res.json(avaliacao);
    } catch (erro) { next(erro); }
}

