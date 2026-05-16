import db from '../../src/config/database';

const insertTipoExame = db.prepare(`
  INSERT INTO tipoExame (nome, descricao, ativo) VALUES (?, ?, ?)
`);

const tipoExames = [
  { nome: 'Espirometria com Prova de Broncodilatador', descricao: 'Exame funcional respiratório que mede o volume e o fluxo de ar que o paciente consegue expirar.', ativo: 1 },
  { nome: 'Testes Cutâneos de Alergia por Picada (Prick Tests)', descricao: 'Exame realizado na pele do antebraço para identificar a sensibilidade a alergénios aéreos comuns.', ativo: 1 },
  { nome: 'Doseamento de Óxido Nítrico Exalado', descricao: 'Um exame não invasivo onde o paciente apenas precisa de soprar para um equipamento.', ativo: 1 },
  { nome: 'Rinomanometria Computadorizada', descricao: 'Exame que avalia a função respiratória nasal, medindo o fluxo de ar e a resistência à passagem do mesmo através das fossas nasais.', ativo: 1 },
];

tipoExames.forEach(tipoExame => {
  insertTipoExame.run(tipoExame.nome, tipoExame.descricao, tipoExame.ativo);
});

const insertAvaliacaoCarat = db.prepare(`
    INSERT INTO avaliacaoCarat (utenteId, dataAvaliacao, scoreAsma, scoreRinite, scoreTotal, proximaAvaliacaoSugerida, observacoes)
    VALUES (?,?,?,?,?,?,?)
`);

const avaliacoesCarat = [
    // UTENTE A: Deterioração Progressiva (Id: 1)
    {utenteId: 1, dataAvaliacao: '2026-03-01', scoreAsma: 18, scoreRinite: 8, scoreTotal: 26, proximaAvaliacaoSugerida: '2026-04-01',observacoes: 'Sintomas controlados na primeira avaliação.'},
    {utenteId: 1, dataAvaliacao: '2026-04-01', scoreAsma: 12, scoreRinite: 5, scoreTotal: 17, proximaAvaliacaoSugerida: '2026-05-01', observacoes: 'Ligeiro aumento da sintomatologia respiratória.'},
    {utenteId: 1, dataAvaliacao: '2026-05-01', scoreAsma: 4, scoreRinite: 2, scoreTotal: 6, proximaAvaliacaoSugerida: '2026-05-08', observacoes: 'Queda abrupta de 11 pontos desde a última avaliação. Alerta de deterioração crítico.'},
  
    // UTENTE B: Controlo Insuficiente Estável (Id: 2)
    {utenteId: 2, dataAvaliacao: '2026-04-15', scoreAsma: 7, scoreRinite: 3, scoreTotal: 10, proximaAvaliacaoSugerida: '2026-05-15', observacoes: 'Doença não controlada. Score marcadamente abaixo do limiar clínico.'},
    {utenteId: 2, dataAvaliacao: '2026-05-15', scoreAsma: 7, scoreRinite: 3, scoreTotal: 10, proximaAvaliacaoSugerida: '2026-06-15', observacoes: 'Estado estacionário de controlo insuficiente. Sem sinais de melhoria.'},
  
    // UTENTE C: Totalmente Controlado (Id: 3)
    {utenteId: 3, dataAvaliacao: '2026-04-10', scoreAsma: 18, scoreRinite: 12, scoreTotal: 30, proximaAvaliacaoSugerida: '2026-05-10', observacoes: 'Controlo ótimo e absoluto dos sintomas (Score máximo).'},
    {utenteId: 3, dataAvaliacao: '2026-05-10', scoreAsma: 17, scoreRinite: 11, scoreTotal: 28, proximaAvaliacaoSugerida: '2026-06-10',observacoes: 'Paciente mantém-se controlado e clinicamente estável.'},
  
    // UTENTE D: Revisão Terapêutica (Id: 4)
    {utenteId: 4, dataAvaliacao: '2026-05-14', scoreAsma: 4, scoreRinite: 2, scoreTotal: 6, proximaAvaliacaoSugerida: '2026-05-21',observacoes: 'Sintomas graves persistentes. Necessita de cruzamento com medicação ativa para revisão.'}
];

avaliacoesCarat.forEach (avaliacaoCarat => {
    insertAvaliacaoCarat.run(avaliacaoCarat.utenteId, avaliacaoCarat.dataAvaliacao, avaliacaoCarat.scoreAsma, avaliacaoCarat.scoreRinite, avaliacaoCarat.scoreTotal, avaliacaoCarat.proximaAvaliacaoSugerida, avaliacaoCarat.observacoes)
});


const insertRepostasCarat = db.prepare(`
    INSERT INTO respostaCarat (avaliacaoCaratId, nPergunta, valorResposta, seccao) VALUES (?,?,?,?)
`);

const respostasCarat = [
    // UTENTE A (Avaliações 1, 2 e 3)

    // Avaliação 1 (ID: 1) -> Rinite: 2, 2, 2, 2 | Asma: 3, 3, 3, 3, 3, 3
    { avaliacaoCaratId: 1, nPergunta: '1', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 1, nPergunta: '2', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 1, nPergunta: '3', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 1, nPergunta: '4', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 1, nPergunta: '5', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 1, nPergunta: '6', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 1, nPergunta: '7', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 1, nPergunta: '8', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 1, nPergunta: '9', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 1, nPergunta: '10', valorResposta: 3, seccao: 'ASMA' },
  
    // Avaliação 2 (ID: 2) -> Rinite: 1, 1, 2, 1 | Asma: 2, 2, 2, 2, 2, 2
    { avaliacaoCaratId: 2, nPergunta: '1', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 2, nPergunta: '2', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 2, nPergunta: '3', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 2, nPergunta: '4', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 2, nPergunta: '5', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 2, nPergunta: '6', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 2, nPergunta: '7', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 2, nPergunta: '8', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 2, nPergunta: '9', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 2, nPergunta: '10', valorResposta: 2, seccao: 'ASMA' },
  
    // Avaliação 3 (ID: 3) -> Rinite: 0, 1, 1, 0 | Asma: 1, 1, 0, 1, 1, 0
    { avaliacaoCaratId: 3, nPergunta: '1', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 3, nPergunta: '2', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 3, nPergunta: '3', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 3, nPergunta: '4', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 3, nPergunta: '5', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 3, nPergunta: '6', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 3, nPergunta: '7', valorResposta: 0, seccao: 'ASMA' },
    { avaliacaoCaratId: 3, nPergunta: '8', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 3, nPergunta: '9', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 3, nPergunta: '10', valorResposta: 0, seccao: 'ASMA' },
  
    // UTENTE B (Avaliações 4 e 5)
    
    // Avaliação 1 (ID: 4) -> Rinite: 1, 1, 0, 1 | Asma: 1, 1, 2, 1, 1, 1
    { avaliacaoCaratId: 4, nPergunta: '1', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 4, nPergunta: '2', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 4, nPergunta: '3', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 4, nPergunta: '4', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 4, nPergunta: '5', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 4, nPergunta: '6', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 4, nPergunta: '7', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 4, nPergunta: '8', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 4, nPergunta: '9', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 4, nPergunta: '10', valorResposta: 1, seccao: 'ASMA' },
  
    // Avaliação 2 (ID: 5) -> Rinite: 1, 0, 1, 1 | Asma: 1, 1, 1, 1, 2, 1
    { avaliacaoCaratId: 5, nPergunta: '1', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 5, nPergunta: '2', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 5, nPergunta: '3', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 5, nPergunta: '4', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 5, nPergunta: '5', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 5, nPergunta: '6', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 5, nPergunta: '7', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 5, nPergunta: '8', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 5, nPergunta: '9', valorResposta: 2, seccao: 'ASMA' },
    { avaliacaoCaratId: 5, nPergunta: '10', valorResposta: 1, seccao: 'ASMA' },
  
    // UTENTE C (Avaliações 6 e 7)
    // Avaliação 1 (ID: 6) -> Rinite: 3, 3, 3, 3 | Asma: 3, 3, 3, 3, 3, 3
    { avaliacaoCaratId: 6, nPergunta: '1', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 6, nPergunta: '2', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 6, nPergunta: '3', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 6, nPergunta: '4', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 6, nPergunta: '5', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 6, nPergunta: '6', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 6, nPergunta: '7', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 6, nPergunta: '8', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 6, nPergunta: '9', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 6, nPergunta: '10', valorResposta: 3, seccao: 'ASMA' },
  
    // Avaliação 2 (ID: 7) -> Rinite: 3, 3, 2, 3 | Asma: 3, 3, 3, 3, 3, 2
    { avaliacaoCaratId: 7, nPergunta: '1', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 7, nPergunta: '2', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 7, nPergunta: '3', valorResposta: 2, seccao: 'RINITE' },
    { avaliacaoCaratId: 7, nPergunta: '4', valorResposta: 3, seccao: 'RINITE' },
    { avaliacaoCaratId: 7, nPergunta: '5', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 7, nPergunta: '6', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 7, nPergunta: '7', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 7, nPergunta: '8', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 7, nPergunta: '9', valorResposta: 3, seccao: 'ASMA' },
    { avaliacaoCaratId: 7, nPergunta: '10', valorResposta: 2, seccao: 'ASMA' },

    // UTENTE D (Avaliação 8
    // Avaliação 1 (ID: 8) -> Rinite: 0, 1, 0, 1 | Asma: 1, 0, 1, 1, 0, 1
    { avaliacaoCaratId: 8, nPergunta: '1', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 8, nPergunta: '2', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 8, nPergunta: '3', valorResposta: 0, seccao: 'RINITE' },
    { avaliacaoCaratId: 8, nPergunta: '4', valorResposta: 1, seccao: 'RINITE' },
    { avaliacaoCaratId: 8, nPergunta: '5', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 8, nPergunta: '6', valorResposta: 0, seccao: 'ASMA' },
    { avaliacaoCaratId: 8, nPergunta: '7', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 8, nPergunta: '8', valorResposta: 1, seccao: 'ASMA' },
    { avaliacaoCaratId: 8, nPergunta: '9', valorResposta: 0, seccao: 'ASMA' },
    { avaliacaoCaratId: 8, nPergunta: '10', valorResposta: 1, seccao: 'ASMA' }
  ];

  respostasCarat.forEach(resposta => {
    insertRepostasCarat.run(resposta.avaliacaoCaratId, resposta.nPergunta, resposta.valorResposta, resposta.seccao);
  });

const inserttSintomaReportado = db.prepare(`
  INSERT INTO sintomaReportado (utenteId, descricao, gravidade, dataInicioSintoma, dataRegisto, tipo) 
  VALUES (?, ?, ?, ?, ?, ?)
`)

const sintomasReportados = [
    { utenteId: 1, descricao: 'Falta de ar progressiva e pieira ao deitar.', gravidade: 3, dataInicioSintoma: '2026-04-28', dataRegisto: '2026-05-01 09:30:00', tipo: 'ASMA' },
    { utenteId: 2, descricao: 'Congestão nasal persistente e espirros frequentes acordar.', gravidade: 2, dataInicioSintoma: '2026-04-10', dataRegisto: '2026-04-15 14:15:00', tipo: 'RINITE' },
    { utenteId: 4, descricao: 'Tosse seca contínua que interfere com o sono.', gravidade: 3, dataInicioSintoma: '2026-05-10', dataRegisto: '2026-05-14 08:45:00', tipo: 'ASMA' }
];
    
    
sintomasReportados.forEach(sintoma => { 
    inserttSintomaReportado.run(sintoma.utenteId, sintoma.descricao, sintoma.gravidade, sintoma.dataInicioSintoma, sintoma.dataRegisto, sintoma.tipo); 
});


const insertMedicacao = db.prepare(`
    INSERT INTO medicacao (utenteId, medicoId, nome, dose, dataInicio, dataFim) 
    VALUES (?,?,?,?,?,?)
`)

const medicacao = [
    { utenteId: 1, medicoId: 1, nome: 'Fluticasona + Salmeterol (Inalador)', dose: '1 insuflação 12h/12h', dataInicio: '2026-03-01 08:00:00', dataFim: null }, 
    { utenteId: 2, medicoId: 2, nome: 'Budesonida (Inalador de pó seco)', dose: '200 mcg 1 vez ao dia', dataInicio: '2026-04-15 09:00:00', dataFim: '2026-05-15 09:00:00' }, 
    { utenteId: 3, medicoId: 2, nome: 'Ebastina 10mg (Anti-histamínico)', dose: '1 comprimido ao deitar', dataInicio: '2026-04-10 21:00:00', dataFim: '2026-05-10 21:00:00' }, 
    { utenteId: 4, medicoId: 1, nome: 'Mometasona (Spray Nasal)', dose: '2 pulverizações em cada narina, 1 vez ao dia', dataInicio: '2026-04-24 08:00:00', dataFim: null }
]; 


medicacao.forEach( med => { 
   insertMedicacao.run(med.utenteId, med.medicoId, med.nome, med.dose, med.dataInicio, med.dataFim); 
});

const insertExame = db.prepare(`
    INSERT INTO exame (utenteId, medicoId, tipoExameId, data, resultado, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const exames = [
    { utenteId: 1, medicoId: 1, tipoExameId: 1, data: '2026-03-01 10:30:00', resultado: 'VEF1/CVF: 68% (Obstrução ligeira das vias aéreas). Reversibilidade positiva após broncodilatador (+14% no VEF1).', observacoes: 'Resultado compatível com o quadro clínico de Asma brônquica.' }, 
    { utenteId: 2, medicoId: 2, tipoExameId: 2, data: '2026-04-15 11:00:00', resultado: 'Pápula de 4mm para Dermatophagoides pteronyssinus e 3mm para ácaros do pó doméstico. Negativo para pólens.', observacoes: 'Sensibilização clara a ácaros, justificando a sintomatologia de Rinite Alérgica.' }
];

exames.forEach ( exame => { 
    insertExame.run(exame.utenteId, exame.medicoId, exame.tipoExameId, exame.data, exame.resultado, exame.observacoes); 
});

console.log('Seeds de Med criados com sucesso!');