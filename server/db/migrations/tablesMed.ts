import db from '../../src/config/database';

db.exec(`

    CREATE TABLE IF NOT EXISTS avaliacaoCarat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER NOT NULL,
    respostas TEXT,
    scoreTotal NUMBER,
    nivelControlo TEXT,
    recomendacoes TEXT,
    criadoEm DATETIME,
    FOREIGN KEY (utenteId) REFERENCES utentes(id)
    );

    CREATE TABLE IF NOT EXISTS sintoma (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER NOT NULL,
    descricao TEXT,
    gravidade TEXT,
    data DATETIME,
    fonte TEXT,
    criadoPor TEXT,
    FOREIGN KEY (utenteId) REFERENCES utentes(id)
    );

    CREATE TABLE IF NOT EXISTS medicacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER NOT NULL,
    nome TEXT,
    dose TEXT,
    dataInicio DATETIME,
    dataFim DATETIME,
    fonte TEXT,
    criadoPor TEXT,
    FOREIGN KEY (utenteId) REFERENCES utentes(id)
    );

    CREATE TABLE IF NOT EXISTS exame (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utenteId INTEGER NOT NULL,
    tipo TEXT,
    data DATETIME,
    resultado TEXT,
    FOREIGN KEY (utenteId) REFERENCES utentes(id)
    );

`);

console.log('Tabelas de avaliação, sintomas, medicação e exames criadas com sucesso.');