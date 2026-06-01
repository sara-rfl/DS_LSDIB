import db from '../config/database';

export function guardarExame(
    utenteId: number,
    medicoId: number,
    tipoExameId: number,
    data: string,
    resultado: string,
    observacoes: string | null
) {
    const resultadoInsert = db.prepare(`
        INSERT INTO exame (utenteId, medicoId, tipoExameId, data, resultado, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(utenteId, medicoId, tipoExameId, data, resultado, observacoes);

    return resultadoInsert.lastInsertRowid as number;
}

export function listarExames(utenteId: number) {
    return db.prepare(`
        SELECT id, utenteId, medicoId, tipoExameId, data, resultado, observacoes
        FROM exame
        WHERE utenteId = ?
        ORDER BY data DESC
    `).all(utenteId);
}

export function eliminarExame(exameId: number) {
    db.prepare(`
        DELETE FROM exame
        WHERE id = ?
    `).run(exameId);
}   

export function tipoExameExiste (tipoExameId: number): boolean {
    const stmt = db.prepare(`
        SELECT id FROM tipoExame WHERE id = ?
    `);
    const row = stmt.get(tipoExameId) as { id: number } | undefined;
    
    return row !== undefined

}