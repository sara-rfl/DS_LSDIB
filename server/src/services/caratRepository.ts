import db from '../config/database';

export function guardarAvaliacao(
    utenteId: number,
    scores: { scoreRinite: number; scoreAsma: number; scoreTotal: number },
    respostas: number[]
) {
    const dataAvaliacao = new Date().toISOString();

    const result = db.prepare(`
        INSERT INTO avaliacaoCarat (utenteId, dataAvaliacao, scoreRinite, scoreAsma, scoreTotal)
        VALUES (?, ?, ?, ?, ?)
    `).run(utenteId, dataAvaliacao, scores.scoreRinite, scores.scoreAsma, scores.scoreTotal);

    const avaliacaoId = result.lastInsertRowid;

    const insertResposta = db.prepare(`
        INSERT INTO respostaCarat (avaliacaoCaratId, nPergunta, valorResposta, seccao)
        VALUES (?, ?, ?, ?)
    `);

    respostas.forEach((valor, index) => {
        const seccao = index < 4 ? 'rinite' : 'asma';
        insertResposta.run(avaliacaoId, index + 1, valor, seccao);
    });

    return avaliacaoId;
}

export function getUltimaAvaliacao(utenteId: number) {
    return db.prepare(`
        SELECT id, utenteId, dataAvaliacao, scoreAsma, scoreRinite, scoreTotal
        FROM avaliacaoCarat
        WHERE utenteId = ?
        ORDER BY dataAvaliacao DESC
        LIMIT 1
    `).get(utenteId) ?? null;
}

export function getDelta(): number {
    const config = db.prepare(`
        SELECT valor FROM configuracaoLimiar WHERE chave = 'deltaDeterioracao'
    `).get() as { valor: number } | undefined;

    if (!config) throw new Error('Configuração de limiar delta não encontrada');
    return config.valor;
}
