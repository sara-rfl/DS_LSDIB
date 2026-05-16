import db from '../../src/config/database';

db.exec(`
  CREATE TABLE IF NOT EXISTS configuracaoLimiar (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   chave VARCHAR(50),
   valor NUMERIC(19,0),
   descricao TEXT
  );

  CREATE TABLE IF NOT EXISTS alerta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utenteId INTEGER,
  medicoId INTEGER,
  avaliacaoCaratId INTEGER,
  tipo  VARCHAR(50),
  prioridade   VARCHAR (10) CHECK (prioridade IN ('baixa', 'media', 'alta')),
  estado    VARCHAR(20) CHECK (estado IN('Ativo', 'Reconhecido', 'Resolvido')),
  motivo TEXT,
  atualizadoEm  DATETIME,
  criadoEm  DATETIME,
  FOREIGN KEY (utenteId) REFERENCES utente(id) ON DELETE SET NULL,
  FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL,
  FOREIGN KEY (avaliacaoCaratId) REFERENCES avaliacaoCarat(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS acaoAlerta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alertaId INTEGER,
  medicoId INTEGER,
  descricao TEXT,
  criadoEm  DATETIME,
  FOREIGN KEY (alertaId) REFERENCES alerta(id) ON DELETE SET NULL,
  FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL
  );

`);

console.log('Tabela configSistema criada com sucesso.');