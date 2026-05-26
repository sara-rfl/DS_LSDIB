import { Request, Response, NextFunction } from 'express';
import { processarAvaliacao } from '../services/caratService';
import { guardarAvaliacao } from '../services/caratRepository';
import { gerarAlertas } from '../services/alertaEngine';
import { guardarAlerta, getMedicoDoUtente, temMedicacaoAtiva } from '../services/alertaRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { utenteId, respostas } = req.body;
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
        const alertas = gerarAlertas(contexto, utenteId, medicoId, avaliacaoCaratId);
        alertas.forEach(alerta => guardarAlerta(alerta));
        res.status(201).json({ ...resultado, alertasGerados: alertas });
    } catch (erro) { next(erro); }
}
 
