import db from '../config/database';

db.exec(`
  CREATE TABLE IF NOT EXISTS registoAuditoria (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizadorId  INTEGER,
    nome          VARCHAR(255),
    perfil        VARCHAR(20),
    metodo        VARCHAR(10),
    recurso       VARCHAR(255),
    ip            VARCHAR(50),
    criadoEm      DATETIME NOT NULL,
    FOREIGN KEY (utilizadorId) REFERENCES utilizador(id) ON DELETE SET NULL
  );
`);

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

export function limpar() {
  db.prepare('DELETE FROM registoAuditoria').run();
}
