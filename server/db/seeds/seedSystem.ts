import db from '../../src/config/database';

const insertConfigLimiar = db.prepare(`
  INSERT INTO configuracaoLimiar (atualizadoPor, chave, valor, descricao) VALUES (?,?, ?,?)
`);

const limiares = [
    { atualizadoPor: 7 ,chave: 'limiarControloInsuficiente', valor: 24, descricao: 'Pontuação limite. Valores <= 24 indicam que a asma/rinite não estão controladas.'},
    { atualizadoPor: 7, chave: 'deltaDeterioracao', valor: 4, descricao: 'Variação negativa mínima entre avaliações para considerar um agravamento clínico importante.'},
    { atualizadoPor: 7, chave: 'scoreMaximoPossivel', valor: 30, descricao: 'Pontuação máxima do CARAT (controlo absoluto).'},
    { atualizadoPor: 7, chave: 'scoreMinimoPossivel', valor: 0, descricao: 'Pontuação mínima do CARAT.'},
  ];

limiares.forEach(limiar => {
  insertConfigLimiar.run(limiar.atualizadoPor, limiar.chave, limiar.valor, limiar.descricao);
});


const insertAlerta = db.prepare(`
    INSERT INTO alerta (utenteId, medicoId, avaliacaoCaratId, tipo, prioridade, estado, motivo, atualizadoEm, criadoEm)
    VALUES (?,?,?,?,?,?,?,?,?)
`);

const alertas = [
    { utenteId: 1, medicoId: 1, avaliacaoCaratId: 3, tipo: 'DETERIORACAO_CLINICA', prioridade: 1, estado: 'Novo', motivo: 'Queda abrupta de 11 pontos no score total do CARAT entre avaliações consecutivas.', atualizadoEm: '2026-05-01 10:00:00', criadoEm: '2026-05-01 10:00:00' }, 
    { utenteId: 2, medicoId: 2, avaliacaoCaratId: 5, tipo: 'CONTROLO_INSUFICIENTE', prioridade: 2, estado: 'Novo', motivo: 'Score total do CARAT persistente em 10 pontos (abaixo do limiar de controlo de 24).', atualizadoEm: '2026-05-15 14:30:00', criadoEm: '2026-05-15 14:30:00' }, 
    { utenteId: 4, medicoId: 1, avaliacaoCaratId: 8, tipo: 'REVISAO_TERAPEUTICA', prioridade: 3, estado: 'Novo', motivo: 'Sintomas graves persistentes (Score: 6) em utente com medicação ativa há mais de 15 dias.', atualizadoEm: '2026-05-14 09:15:00', criadoEm: '2026-05-14 09:15:00' }
];

alertas.forEach(alerta => { 
    insertAlerta.run(alerta.utenteId, alerta.medicoId, alerta.avaliacaoCaratId, alerta.tipo, alerta.prioridade, alerta.estado, alerta.motivo, alerta.atualizadoEm, alerta.criadoEm); 
});

const insertAcaoAlerta = db.prepare(`
    INSERT INTO acaoAlerta (alertaId, medicoId, descricao, criadoEm )
    VALUES (?,?,?,?)
`);



const acaoAlerta = [
    { alertaId: 1, medicoId: 1, descricao: 'O médico visualizou o alerta de deterioração clínica e agendou uma consulta de urgência com o utente.', criadoEm: '2026-05-01 11:15:00' },
    { alertaId: 2, medicoId: 2, descricao: 'Alerta verificado. O médico reavaliou o histórico do utente e manteve o plano terapêutico atual.', criadoEm: '2026-05-15 16:00:00' }
];
    
acaoAlerta.forEach ( acao => { 
    insertAcaoAlerta.run(acao.alertaId, acao.medicoId, acao.descricao, acao.criadoEm); 
});

console.log('Seeds de System criados com sucesso!')