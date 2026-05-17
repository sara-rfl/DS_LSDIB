import db from '../../src/config/database';

db.exec(`

    CREATE TABLE IF NOT EXISTS avaliacaoCarat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId   INTEGER,
    dataAvaliacao DATETIME,
    scoreAsma       INTEGER CHECK (scoreAsma BETWEEN 0 AND 18),
    scoreRinite     INTEGER CHECK (scoreRinite BETWEEN 0 AND 12),
    scoreTotal      INTEGER CHECK (scoreTotal BETWEEN 0 AND 30),
    proximaAvaliacaoSugerida    DATE,
    observacoes     TEXT,
    FOREIGN KEY (utenteId) REFERENCES utente(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS sintomaReportado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER,
    descricao TEXT,
    gravidade INTEGER CHECK(gravidade IN (1, 2, 3)),
    dataInicioSintoma DATE,
    dataRegisto   DATETIME,
    tipo        VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS medicacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER,
    medicoId INTEGER,
    nome VARCHAR(255),
    dose VARCHAR(100),
    dataInicio DATETIME,
    dataFim DATETIME,
    FOREIGN KEY (utenteId) REFERENCES utente(id) ON DELETE SET NULL,
    FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL
    );


    CREATE TABLE IF NOT EXISTS tipoExame (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100),
    descricao TEXT,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS exame (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER,
    medicoId INTEGER,
    tipoExameId INTEGER,
    data DATETIME,
    resultado TEXT,
    observacoes TEXT,
    FOREIGN KEY (utenteId) REFERENCES utente(id) ON DELETE SET NULL,
    FOREIGN KEY (medicoId) REFERENCES medico(id) ON DELETE SET NULL,
    FOREIGN KEY (tipoExameId) REFERENCES tipoExame(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS respostaCarat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    avaliacaoCaratId    INTEGER,
    nPergunta   INTEGER CHECK (nPergunta BETWEEN 1 AND 10),
    valorResposta   INTEGER CHECK (valorResposta BETWEEN 0 AND 3),
    seccao      VARCHAR(10),
    FOREIGN KEY (avaliacaoCaratId) REFERENCES avaliacaoCarat(id) ON DELETE SET NULL
    );

`);

console.log('Tabelas de avaliação, sintomas, medicação e exames criadas com sucesso.');