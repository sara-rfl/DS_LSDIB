export type TipoAlerta = 'DETERIORACAO_CLINICA' | 'CONTROLO_INSUFICIENTE' | 'REVISAO_TERAPEUTICA';

export interface AlertaCandidato {
  readonly utenteId: number;
  medicoId: number | null;
  avaliacaoCaratId: number;
  tipo: TipoAlerta;
  prioridade: 1| 2 | 3;
  motivo: string;
}

interface ContextoParaAlerta {
  scores: {
    scoreTotal: number;
    scoreRinite: number;
    scoreAsma: number;
  };
  interpretacao: {
    rinite: string;
    asma: string;
    geral: string;
  };
  deteriorou: boolean;
  temMedicacaoAtiva: boolean;
}

export function gerarAlertas(contexto: ContextoParaAlerta, utenteId: number, medicoId: number | null, avaliacaoCaratId: number ): AlertaCandidato[] {
    const alertas: AlertaCandidato[] = [];

    if (contexto.deteriorou === true) {
        alertas.push({
            utenteId,
            medicoId,
            avaliacaoCaratId,
            tipo: 'DETERIORACAO_CLINICA',
            prioridade: 1,
            motivo: 'Deterioração clínica significativa detectada'
        });
    }

    if (contexto.interpretacao.geral === 'NÃO CONTROLADO') {
        alertas.push({
            utenteId,
            medicoId,
            avaliacaoCaratId,
            tipo: 'CONTROLO_INSUFICIENTE',
            prioridade: 2,
            motivo: 'Controlo insuficiente da doença detectado'
        });
    }

    if (contexto.interpretacao.geral === 'NÃO CONTROLADO' && contexto.temMedicacaoAtiva) {
        alertas.push({
            utenteId,
            medicoId,
            avaliacaoCaratId,
            tipo: 'REVISAO_TERAPEUTICA',
            prioridade: 3,
            motivo: 'Revisão terapêutica recomendada devido a resultados atuais'
        });
    }

    return alertas;
}