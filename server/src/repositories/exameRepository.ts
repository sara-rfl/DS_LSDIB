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
        SELECT e.id, e.utenteId, e.medicoId, e.tipoExameId, e.data, e.resultado, e.observacoes,
               t.nome AS tipoExameNome
        FROM exame e
        JOIN tipoExame t ON t.id = e.tipoExameId
        WHERE e.utenteId = ?
        ORDER BY e.data DESC
    `).all(utenteId);
}

export function atualizarExame(exameId: number, resultado: string, observacoes: string | null) {
    db.prepare(`UPDATE exame SET resultado = ?, observacoes = ? WHERE id = ?`).run(resultado, observacoes, exameId);
}

export function eliminarExame(exameId: number) {
    db.prepare(`DELETE FROM exame WHERE id = ?`).run(exameId);
}

export function listarTiposExame() {
    return db.prepare(`SELECT id, nome, descricao FROM tipoExame WHERE ativo = 1`).all();
}   

export function tipoExameExiste (tipoExameId: number): boolean {
    const stmt = db.prepare(`
        SELECT id FROM tipoExame WHERE id = ?
    `);
    const row = stmt.get(tipoExameId) as { id: number } | undefined;
    
    return row !== undefined

}