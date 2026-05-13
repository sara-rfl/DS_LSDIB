import db from '../../src/config/database';

db.exec(`
  CREATE TABLE IF NOT EXISTS configSistema (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scoreMinimo NUMBER,
    deltaDeterioration NUMBER,
    alteradoPor TEXT,
    alteradoEm DATETIME
  );

  CREATE TABLE IF NOT EXISTS alerta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utenteId INTEGER NOT NULL,
  respostas TEXT,
  scoreTotal NUMBER,
  nivelControlo TEXT,
  recomendacoes TEXT,
  alteradoEm DATETIME,
  FOREIGN KEY (utenteId) REFERENCES utente(id)
  );
  
`);

console.log('Tabela configSistema criada com sucesso.');