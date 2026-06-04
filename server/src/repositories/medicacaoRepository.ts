import db from '../config/database';

export function guardarMedicacao(
    utenteId: number,
    medicoId:number,
    nome: string,
    dose: string,
    dataInicio: string,
    dataFim: string | null) 
{
    const resultado = db.prepare(`
        INSERT INTO medicacao (utenteId, medicoId, nome, dose, dataInicio, dataFim)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(utenteId, medicoId, nome, dose, dataInicio, dataFim);

    return resultado.lastInsertRowid as number;
}

export function listarMedicacao(utenteId: number) {
    return db.prepare(`
        SELECT id, utenteId, medicoId, nome, dose, dataInicio, dataFim
        FROM medicacao
        WHERE utenteId = ?
        ORDER BY dataInicio DESC
    `).all(utenteId);
}

export function atualizarMedicacao(medicacaoId: number, nome: string, dose: string, dataInicio: string, dataFim: string | null) {
    db.prepare(`
        UPDATE medicacao SET nome = ?, dose = ?, dataInicio = ?, dataFim = ?
        WHERE id = ?
    `).run(nome, dose, dataInicio, dataFim, medicacaoId);
}

export function eliminarMedicacao(medicacaoId: number) {
    db.prepare(`
        DELETE FROM medicacao
        WHERE id = ?
    `).run(medicacaoId);
}


