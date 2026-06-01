import db from '../config/database';
import { AlertaCandidato } from './alertaEngine';

export function guardarAlerta(alerta: AlertaCandidato): number {
    const agora = new Date().toISOString();
    const stmt = db.prepare(`
        INSERT INTO alerta (utenteId, medicoId, avaliacaoCaratId, tipo, prioridade, estado, motivo, atualizadoEm, criadoEm)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        alerta.utenteId,
        alerta.medicoId,
        alerta.avaliacaoCaratId,
        alerta.tipo,
        alerta.prioridade,
        'Novo',
        alerta.motivo,
        agora,
        agora
    );
    return info.lastInsertRowid as number;
}

export function getMedicoDoUtente(utenteId: number): number | null {
    const stmt = db.prepare(`
        SELECT medicoId FROM utente WHERE id = ?
    `);
    const row = stmt.get(utenteId) as { medicoId: number | null } | undefined;
    
    return row?.medicoId ?? null;

}

export function temMedicacaoAtiva(utenteId: number): boolean {
    const stmt = db.prepare(`
        SELECT COUNT(*) as count FROM medicacao 
        WHERE utenteId = ? AND (dataFim IS NULL OR dataFim > ?)
    `);
    const agora = new Date().toISOString();
    const row = stmt.get(utenteId, agora) as { count: number };
    return row.count > 0;

}


export function listarAlertas(filtros: { utenteId?: number; medicoId?: number; estado?: string }) {
    let query = `SELECT * FROM alerta WHERE 1=1`;
    const params: any[] = [];

    if (filtros.utenteId) {
        query += ` AND utenteId = ?`;
        params.push(filtros.utenteId);
    }
    if (filtros.medicoId) {
        query += ` AND medicoId = ?`;
        params.push(filtros.medicoId);
    }
    if (filtros.estado) {
        query += ` AND estado = ?`;
        params.push(filtros.estado);
    }

    const stmt = db.prepare(query);
    return stmt.all(...params);
}

export function atualizarEstadoAlerta(alertaId: number, novoEstado: 'Novo' | 'Visto' | 'Em_Seguimento' | 'Fechado') {
    const agora = new Date().toISOString();
    const stmt = db.prepare(`
        UPDATE alerta SET estado = ?, atualizadoEm = ? WHERE id = ?
    `);
    stmt.run(novoEstado, agora, alertaId);
}

export function adicionarAcaoAlerta(alertaId: number, medicoId: number, descricao: string) {
    const agora = new Date().toISOString();
    const stmt = db.prepare(`
        INSERT INTO acaoAlerta (alertaId, medicoId, descricao, criadoEm)
        VALUES (?, ?, ?, ?)
    `);
    stmt.run(alertaId, medicoId, descricao, agora);
}   

export function getAlertaPorId(alertaId: number) {
    const stmt = db.prepare(`
        SELECT * FROM alerta WHERE id = ?
    `);
    return stmt.get(alertaId);
}

