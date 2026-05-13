import db from '../../src/config/database';


//Perfis
db.exec(`
  CREATE TABLE IF NOT EXISTS utilizador (
    id           INTEGER  PRIMARY KEY AUTOINCREMENT,
    email        TEXT     NOT NULL UNIQUE,
    passwordHash TEXT     NOT NULL,
    perfil       TEXT     NOT NULL CHECK(perfil IN ('admin', 'utente', 'medico')),
    criadoEm    DATETIME,
    alteradoEm  DATETIME
  );

  CREATE TABLE IF NOT EXISTS medico (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizadorId  INTEGER NOT NULL,
    nome          VARCHAR(20) NOT NULL,
    especialidade TEXT    NOT NULL,
    contacto      TEXT    NOT NULL,
    FOREIGN KEY (utilizadorId) REFERENCES utilizador(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS utente (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizadorId INTEGER NOT NULL,
    medicoId     INTEGER NOT NULL,
    nome         VARCHAR(20),
    dataNascimento DATE,
    contacto      TEXT,
    morada        TEXT,
    FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL,
    FOREIGN KEY (utilizadorId) REFERENCES utilizador(id) ON DELETE CASCADE
  );
  
`);

console.log('Tabelas criadas com sucesso.');
