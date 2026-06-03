import db from '../../src/config/database';

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

console.log('Tabela registoAuditoria criada com sucesso.');
