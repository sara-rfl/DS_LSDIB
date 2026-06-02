import request from 'supertest';
import app from '../../src/app';
import db from '../../src/config/database';
import bcrypt from 'bcryptjs';

// ─── Setup / Teardown ─────────────────────────────────────────────
let token: string;

beforeAll(async () => {
    db.exec(`
        DROP TABLE IF EXISTS alerta;
        DROP TABLE IF EXISTS configuracaoLimiar;
        DROP TABLE IF EXISTS respostaCarat;
        DROP TABLE IF EXISTS avaliacaoCarat;
        DROP TABLE IF EXISTS utilizador;

        CREATE TABLE utilizador (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            passwordHash TEXT NOT NULL,
            nome TEXT,
            perfil TEXT,
            criadoEm TEXT
        );
        CREATE TABLE avaliacaoCarat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utenteId INTEGER,
            dataAvaliacao TEXT,
            scoreAsma INTEGER,
            scoreRinite INTEGER,
            scoreTotal INTEGER
        );
        CREATE TABLE respostaCarat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            avaliacaoCaratId INTEGER,
            nPergunta INTEGER,
            valorResposta INTEGER,
            seccao TEXT
        );
        CREATE TABLE configuracaoLimiar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            atualizadoPor INTEGER,
            chave TEXT,
            valor NUMERIC,
            descricao TEXT
        );
        CREATE TABLE alerta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utenteId INTEGER,
            medicoId INTEGER,
            avaliacaoCaratId INTEGER,
            tipo TEXT,
            prioridade INTEGER,
            estado TEXT,
            motivo TEXT,
            atualizadoEm TEXT,
            criadoEm TEXT
        );
    `);

    const hash = bcrypt.hashSync('password123', 10);
    db.prepare(`INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm) VALUES (?,?,?,?,?)`)
        .run('pedrocunha@clinic.pt', hash, 'Pedro Cunha', 'medico', new Date().toISOString());

    db.prepare(`INSERT INTO configuracaoLimiar (atualizadoPor, chave, valor, descricao) VALUES (?,?,?,?)`)
        .run(1, 'deltaDeterioracao', 4, 'Variação mínima para deterioração');

    db.prepare(`INSERT INTO alerta (utenteId, medicoId, avaliacaoCaratId, tipo, prioridade, estado, motivo, atualizadoEm, criadoEm) VALUES (?,?,?,?,?,?,?,?,?)`)
        .run(1, 1, 1, 'DETERIORACAO_CLINICA', 1, 'Novo', 'Queda abrupta de score', '2026-05-01', '2026-05-01');

    // Fazer login uma vez e guardar o token para todos os testes
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'pedrocunha@clinic.pt', password: 'password123' });
    token = res.body.token;
});

// ─── Login ────────────────────────────────────────────────────────
describe('POST /auth/login', () => {

    test('credenciais válidas → 200 + token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'pedrocunha@clinic.pt', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.perfil).toBe('medico');
    });

    test('password errada → 401', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'pedrocunha@clinic.pt', password: 'errada' });
        expect(res.status).toBe(401);
    });

});

// ─── Submissão CARAT ──────────────────────────────────────────────
describe('POST /api/carat/avaliacoes', () => {

    test('submissão válida → 201 + scores corretos', async () => {
        const res = await request(app)
            .post('/api/carat/avaliacoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ utenteId: 1, respostas: [2, 2, 2, 2, 3, 3, 3, 3, 3, 3] });

        expect(res.status).toBe(201);
        expect(res.body.scores.scoreRinite).toBe(8);
        expect(res.body.scores.scoreAsma).toBe(18);
        expect(res.body.scores.scoreTotal).toBe(26);
    });

    test('sem token → 401', async () => {
        const res = await request(app)
            .post('/api/carat/avaliacoes')
            .send({ utenteId: 1, respostas: [2, 2, 2, 2, 3, 3, 3, 3, 3, 3] });
        expect(res.status).toBe(401);
    });

});

// ─── Listagem de Alertas ──────────────────────────────────────────
describe('GET /api/alertas', () => {

    test('com token → 200 + lista de alertas', async () => {
        const res = await request(app)
            .get('/api/alertas')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('tipo', 'DETERIORACAO_CLINICA');
    });

    test('sem token → 401', async () => {
        const res = await request(app)
            .get('/api/alertas');
        expect(res.status).toBe(401);
    });

});
