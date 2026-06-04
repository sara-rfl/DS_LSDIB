import db from '../config/database';


export function guardarSintoma(
    utenteId: number,
    descricao: string,
    gravidade: number,
    dataInicioSintoma: string,
    tipo: string,)
 {
    const dataRegisto = new Date().toISOString();

    const result = db.prepare(`
        INSERT INTO sintomaReportado (utenteId, descricao, gravidade, dataInicioSintoma, dataRegisto, tipo)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(utenteId, descricao, gravidade, dataInicioSintoma, dataRegisto, tipo);

    return result.lastInsertRowid;
}

export function listarSintomas(utenteId: number) {
    return db.prepare(`
        SELECT id, utenteId, descricao, gravidade, dataInicioSintoma, dataRegisto, tipo
        FROM sintomaReportado
        WHERE utenteId = ?
        ORDER BY dataRegisto DESC
    `).all(utenteId);
}

export function eliminarSintoma(sintomaId: number) {
    db.prepare(`
        DELETE FROM sintomaReportado
        WHERE id = ?
    `).run(sintomaId);
}   