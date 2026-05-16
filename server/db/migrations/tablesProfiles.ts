import db from '../../src/config/database';



db.exec(`
  CREATE TABLE IF NOT EXISTS utilizador (
    id           INTEGER  PRIMARY KEY AUTOINCREMENT,
    email        VARCHAR(255)     NOT NULL UNIQUE,
    passwordHash VARCHAR(255)    NOT NULL,
    nome         VARCHAR(255) NOT NULL,
    perfil       VARCHAR(10)     NOT NULL CHECK(perfil IN ('utente', 'medico')),
    criadoEm    DATETIME
  );

  CREATE TABLE IF NOT EXISTS medico (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizadorId  INTEGER NOT NULL,
    especialidade VARCHAR(100)    NOT NULL,
    telefone      INTEGER   NOT NULL,
    nrOrdem       INTEGER   NOT NULL,
    FOREIGN KEY (utilizadorId) REFERENCES utilizador(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS utente (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    utilizadorId INTEGER NOT NULL,
    medicoId     INTEGER,
    nUtente      INTEGER NOT NULL,
    dataNascimento DATE,
    telefone       INTEGER,
    morada        TEXT,
    genero        VARCHAR(10) CHECK(genero IN('masculino','feminino')),
    FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL,
    FOREIGN KEY (utilizadorId) REFERENCES utilizador(id) ON DELETE SET NULL
  );


  
`);

console.log('Tabelas criadas com sucesso.');
