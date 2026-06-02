import db from '../config/database';

interface RegistoAuditoria {
  utilizadorId?: number;
  nome?: string;
  perfil?: string;
  metodo: string;
  recurso: string;
  ip: string;
}

export function registar(dados: RegistoAuditoria) {
  db.prepare(`
    INSERT INTO registoAuditoria (utilizadorId, nome, perfil, metodo, recurso, ip, criadoEm)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    dados.utilizadorId ?? null,
    dados.nome ?? null,
    dados.perfil ?? null,
    dados.metodo,
    dados.recurso,
    dados.ip,
    new Date().toISOString()
  );
}

export function listar(limite = 200) {
  return db.prepare(`
    SELECT * FROM registoAuditoria
    ORDER BY criadoEm DESC
    LIMIT ?
  `).all(limite);
}
