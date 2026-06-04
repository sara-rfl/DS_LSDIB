import { getUltimaAvaliacao, getDelta } from '../repositories/caratRepository';

export function calcularScores(respostas: number[]) {
    const scoreRinite = respostas.slice(0, 4).reduce((sum, val) => sum + val, 0);
    const scoreAsma = respostas.slice(4, 10).reduce((sum, val) => sum + val, 0);
    const scoreTotal = scoreRinite + scoreAsma;
    return { scoreRinite, scoreAsma, scoreTotal };
}



export function interpretarNiveis(scoreRinite: number, scoreAsma: number, scoreTotal: number) {
    const interpretacao = {
        rinite: '',
        asma: '',
        geral: ''
    };

    if (scoreRinite <= 8) {
        interpretacao.rinite = 'Rinite Não Controlada';
    } else {
        interpretacao.rinite = 'Rinite Controlada';
    }

    if (scoreAsma < 16) {
        interpretacao.asma = 'Asma Não Controlada';
    } else {
        interpretacao.asma = 'Asma Controlada';
    }

    if (scoreTotal > 24 || (scoreRinite > 8 && scoreAsma >= 16)) {
        interpretacao.geral = 'CONTROLADO';
    } else {
        interpretacao.geral = 'NÃO CONTROLADO';
    }
    

    return interpretacao;
}

export function gerarRecomendacoes(interpretacao: ReturnType<typeof interpretarNiveis>) {
    const mensagens: string[] = [];

    if (interpretacao.geral === 'CONTROLADO') {
        mensagens.push('Manter Medicação Atual');
        mensagens.push('Continuar a Monitorizar');
        mensagens.push('Repetir daqui a 3 a 6 meses');
    } else if (interpretacao.rinite === 'Rinite Não Controlada' && interpretacao.asma === 'Asma Controlada') {
        mensagens.push('Evitar Alergénios');
        mensagens.push('Considerar Revisão da Medicação Nasal');
        mensagens.push('Sinalizar o médico');
    } else if (interpretacao.asma === 'Asma Não Controlada') {
        mensagens.push('Não Fazer Esforço Físico');
        mensagens.push('Usar Medicação de Resgate se Necessário');
        mensagens.push('Contactar o Médico se Piorar');
        mensagens.push('Repetir Avaliação Mais Cedo');
    } else {
        mensagens.push('Alertar o Médico');
        mensagens.push('Aconselhamento Médico Urgente!');
    }

    return mensagens;
}

export function verificarDeterioracao(
    avaliacaoActual: { scoreTotal: number },
    avaliacaoAnterior: { scoreTotal: number },
    delta: number
) {
    return (avaliacaoAnterior.scoreTotal - avaliacaoActual.scoreTotal) >= delta;
}

export function processarAvaliacao(utenteId: number, respostas: number[]) {
    const scores = calcularScores(respostas);
    const avaliacaoAnterior = getUltimaAvaliacao(utenteId);
    const delta = getDelta();

    const interpretacao = interpretarNiveis(scores.scoreRinite, scores.scoreAsma, scores.scoreTotal);
    const recomendacoes = gerarRecomendacoes(interpretacao);
    const deteriorou = avaliacaoAnterior ? verificarDeterioracao(scores, avaliacaoAnterior, delta) : false;

    return { scores, interpretacao, recomendacoes, deteriorou };
}
