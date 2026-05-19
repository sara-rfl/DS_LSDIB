import db from '../config/database';

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
