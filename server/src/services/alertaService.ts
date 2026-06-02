// Regra 1: rinite OU asma individualmente descontrolada
export function regra1_controloInsuficiente(
    scoreRinite: number,
    scoreAsma: number,
    limiarRinite: number = 8,
    limiarAsma: number = 16
): boolean {
    return scoreRinite <= limiarRinite || scoreAsma < limiarAsma;
}

// Regra 2: score caiu >= delta face à avaliação anterior
export function regra2_deterioracaoClinica(
    scoreAtual: number,
    scoreAnterior: number,
    delta: number
): boolean {
    return (scoreAnterior - scoreAtual) >= delta;
}

// Regra 3: sintoma persistente reportado com medicação ativa registada
export function regra3_revisaoTerapeutica(
    temSintomaPersistente: boolean,
    temMedicacaoAtiva: boolean
): boolean {
    return temSintomaPersistente && temMedicacaoAtiva;
}

// Regra 4: score abaixo de limiar configurável pelo admin
export function regra4_indicacaoExame(
    scoreTotal: number,
    limiar: number
): boolean {
    return scoreTotal <= limiar;
}