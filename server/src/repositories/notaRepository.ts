import db from '../config/database';

export function guardarNota(utenteId: number, medicoId: number, titulo: string | null, conteudo: string) {
    const criadoEm = new Date().toISOString();
    const result = db.prepare(`
        INSERT INTO notaClinica (utenteId, medicoId, titulo, conteudo, criadoEm)
        VALUES (?, ?, ?, ?, ?)
    `).run(utenteId, medicoId, titulo, conteudo, criadoEm);
    return result.lastInsertRowid as number;
}

export function listarNotas(utenteId: number) {
    return db.prepare(`
        SELECT n.id, n.utenteId, n.titulo, n.conteudo, n.criadoEm, u.nome AS medicoNome
        FROM notaClinica n
        JOIN medico m ON m.id = n.medicoId
        JOIN utilizador u ON u.id = m.utilizadorId
        WHERE n.utenteId = ?
        ORDER BY n.criadoEm DESC
    `).all(utenteId);
}
