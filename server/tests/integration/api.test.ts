import request from 'supertest';
import app from '../../src/app';
import db from '../../src/config/database';
import bcrypt from 'bcryptjs';

// ─── Setup / Teardown ─────────────────────────────────────────────
let token: string;        // médico
let tokenUtente: string;  // utente id=1
let tokenUtente2: string; // utente id=2
let tokenAdmin: string;

beforeAll(async () => {
    db.exec(`
        DROP TABLE IF EXISTS acaoAlerta;
        DROP TABLE IF EXISTS alerta;
        DROP TABLE IF EXISTS configuracaoLimiar;
        DROP TABLE IF EXISTS respostaCarat;
        DROP TABLE IF EXISTS avaliacaoCarat;
        DROP TABLE IF EXISTS sintomaReportado;
        DROP TABLE IF EXISTS exame;
        DROP TABLE IF EXISTS tipoExame;
        DROP TABLE IF EXISTS medicacao;
        DROP TABLE IF EXISTS medico;
        DROP TABLE IF EXISTS utente;
        DROP TABLE IF EXISTS utilizador;

        CREATE TABLE utilizador (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            passwordHash TEXT NOT NULL,
            nome TEXT,
            perfil TEXT,
            criadoEm TEXT
        );
        CREATE TABLE medico (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utilizadorId INTEGER,
            especialidade TEXT,
            telefone TEXT,
            nrOrdem TEXT
        );
        CREATE TABLE utente (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utilizadorId INTEGER,
            medicoId INTEGER,
            nUtente INTEGER,
            dataNascimento DATE,
            telefone TEXT,
            morada TEXT,
            genero VARCHAR(10)
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
        CREATE TABLE medicacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utenteId INTEGER,
            medicoId INTEGER,
            nome TEXT,
            dose TEXT,
            dataInicio TEXT,
            dataFim TEXT
        );
        CREATE TABLE sintomaReportado (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utenteId INTEGER,
            descricao TEXT,
            gravidade INTEGER,
            dataInicioSintoma DATE,
            dataRegisto DATETIME,
            tipo TEXT
        );
        CREATE TABLE tipoExame (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            descricao TEXT,
            ativo INTEGER DEFAULT 1
        );
        CREATE TABLE exame (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utenteId INTEGER,
            medicoId INTEGER,
            tipoExameId INTEGER,
            data TEXT,
            resultado TEXT,
            observacoes TEXT
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
        CREATE TABLE acaoAlerta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alertaId INTEGER,
            medicoId INTEGER,
            descricao TEXT,
            criadoEm TEXT
        );
    `);

    const hash = bcrypt.hashSync('password123', 10);

    // utilizador 1: médico
    db.prepare(`INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm) VALUES (?,?,?,?,?)`)
        .run('pedrocunha@clinic.pt', hash, 'Pedro Cunha', 'medico', new Date().toISOString());
    // utilizador 2: utente 1
    db.prepare(`INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm) VALUES (?,?,?,?,?)`)
        .run('mariasilva@clinic.pt', hash, 'Maria Silva', 'utente', new Date().toISOString());
    // utilizador 3: utente 2
    db.prepare(`INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm) VALUES (?,?,?,?,?)`)
        .run('jorgegoncalves@clinic.pt', hash, 'Jorge Gonçalves', 'utente', new Date().toISOString());
    // utilizador 4: admin
    db.prepare(`INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm) VALUES (?,?,?,?,?)`)
        .run('admin@clinic.pt', hash, 'Admin', 'admin', new Date().toISOString());

    db.prepare(`INSERT INTO medico (utilizadorId, especialidade, telefone, nrOrdem) VALUES (?,?,?,?)`)
        .run(1, 'Pneumonologia', '912345678', 'C-12345');

    db.prepare(`INSERT INTO utente (utilizadorId, medicoId, nUtente) VALUES (?,?,?)`)
        .run(2, 1, 111111111);
    db.prepare(`INSERT INTO utente (utilizadorId, medicoId, nUtente) VALUES (?,?,?)`)
        .run(3, 1, 222222222);

    db.prepare(`INSERT INTO configuracaoLimiar (atualizadoPor, chave, valor, descricao) VALUES (?,?,?,?)`)
        .run(1, 'deltaDeterioracao', 4, 'Variação mínima para deterioração');

    db.prepare(`INSERT INTO tipoExame (nome, descricao) VALUES (?,?)`)
        .run('Espirometria', 'Teste de função pulmonar');

    db.prepare(`INSERT INTO alerta (utenteId, medicoId, avaliacaoCaratId, tipo, prioridade, estado, motivo, atualizadoEm, criadoEm) VALUES (?,?,?,?,?,?,?,?,?)`)
        .run(1, 1, null, 'DETERIORACAO_CLINICA', 1, 'Novo', 'Queda abrupta de score', '2026-05-01', '2026-05-01');

    const res = await request(app).post('/auth/login').send({ email: 'pedrocunha@clinic.pt', password: 'password123' });
    token = res.body.token;

    const resU1 = await request(app).post('/auth/login').send({ email: 'mariasilva@clinic.pt', password: 'password123' });
    tokenUtente = resU1.body.token;

    const resU2 = await request(app).post('/auth/login').send({ email: 'jorgegoncalves@clinic.pt', password: 'password123' });
    tokenUtente2 = resU2.body.token;

    const resAdmin = await request(app).post('/auth/login').send({ email: 'admin@clinic.pt', password: 'password123' });
    tokenAdmin = resAdmin.body.token;
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

    test('email malformado → 400', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'nao-e-email', password: 'password123' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('erro');
    });

    test('body vazio → 400', async () => {
        const res = await request(app).post('/auth/login').send({});
        expect(res.status).toBe(400);
    });

});

// ─── validateBody ─────────────────────────────────────────────────
describe('validateBody — rejeição de body inválido', () => {

    test('POST /doctors sem body → 400 com campos em falta', async () => {
        const res = await request(app)
            .post('/doctors')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain("must have required property 'nome'");
    });

    test('POST /doctors com campo extra → 400 additionalProperties', async () => {
        const res = await request(app)
            .post('/doctors')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ nome: 'X', email: 'x@x.pt', password: 'pass123', especialidade: 'X', telefone: '910', nrOrdem: 'X-1', isAdmin: true });
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain('must NOT have additional properties');
    });

    test('PUT /config sem chave → 400', async () => {
        const res = await request(app)
            .put('/config')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({ valor: 5 });
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain("must have required property 'chave'");
    });

    test('POST /patients/:id/sintomas body inválido → 400', async () => {
        const res = await request(app)
            .post('/patients/1/sintomas')
            .set('Authorization', `Bearer ${token}`)
            .send({ descricao: 'Tosse' }); // faltam gravidade, dataInicioSintoma, tipo
        expect(res.status).toBe(400);
    });

    test('POST /patients/:id/medicacao sem nome → 400', async () => {
        const res = await request(app)
            .post('/patients/1/medicacao')
            .set('Authorization', `Bearer ${token}`)
            .send({ dose: '100mg', dataInicio: '2026-01-01' });
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain("must have required property 'nome'");
    });

});

// ─── Controlo de acesso ownership ─────────────────────────────────
describe('verificarProprioUtente — utente não acede a dados alheios', () => {

    test('utente acede aos seus próprios dados → 200', async () => {
        const res = await request(app)
            .get('/patients/1')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe('Maria Silva');
    });

    test('utente acede a dados de outro utente → 403', async () => {
        const res = await request(app)
            .get('/patients/2')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(403);
    });

    test('utente vê sintomas de outro → 403', async () => {
        const res = await request(app)
            .get('/patients/2/sintomas')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(403);
    });

    test('utente vê exames de outro → 403', async () => {
        const res = await request(app)
            .get('/patients/2/exame')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(403);
    });

    test('utente vê medicação de outro → 403', async () => {
        const res = await request(app)
            .get('/patients/2/medicacao')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(403);
    });

    test('utente vê CARAT de outro → 403', async () => {
        const res = await request(app)
            .get('/patients/2/carat')
            .set('Authorization', `Bearer ${tokenUtente}`);
        expect(res.status).toBe(403);
    });

    test('utente submete CARAT para outro → 403', async () => {
        const res = await request(app)
            .post('/patients/2/carat')
            .set('Authorization', `Bearer ${tokenUtente}`)
            .send({ respostas: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1] });
        expect(res.status).toBe(403);
    });

    test('médico acede a dados de qualquer utente → 200', async () => {
        const res = await request(app)
            .get('/patients/2')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    test('sem token → 401', async () => {
        const res = await request(app).get('/patients/1');
        expect(res.status).toBe(401);
    });

});

// ─── Validações de datas ───────────────────────────────────────────
describe('Validações de datas', () => {

    test('medicação dataFim < dataInicio → 400', async () => {
        const res = await request(app)
            .post('/patients/1/medicacao')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'X', dose: '1mg', dataInicio: '2026-06-01', dataFim: '2026-01-01' });
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain('dataFim deve ser posterior a dataInicio');
    });

    test('medicação dataFim = dataInicio → 400', async () => {
        const res = await request(app)
            .post('/patients/1/medicacao')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'X', dose: '1mg', dataInicio: '2026-06-01', dataFim: '2026-06-01' });
        expect(res.status).toBe(400);
    });

    test('medicação sem dataFim → 201', async () => {
        const res = await request(app)
            .post('/patients/1/medicacao')
            .set('Authorization', `Bearer ${token}`)
            .send({ nome: 'Ibuprofeno', dose: '400mg', dataInicio: '2026-06-01' });
        expect(res.status).toBe(201);
        expect(res.body.mensagem).toBeDefined();
    });

    test('exame com data futura → 400', async () => {
        const res = await request(app)
            .post('/patients/1/exame')
            .set('Authorization', `Bearer ${token}`)
            .send({ tipoExameId: 1, data: '2099-01-01' });
        expect(res.status).toBe(400);
        expect(res.body.erro).toContain('não pode ser no futuro');
    });

    test('exame com data de hoje → 201', async () => {
        const hoje = new Date().toISOString().slice(0, 10);
        const res = await request(app)
            .post('/patients/1/exame')
            .set('Authorization', `Bearer ${token}`)
            .send({ tipoExameId: 1, data: hoje });
        expect(res.status).toBe(201);
    });

});

// ─── GET ações do alerta ──────────────────────────────────────────
describe('GET /api/alertas/:id/acoes', () => {

    test('alerta sem ações → lista vazia', async () => {
        const res = await request(app)
            .get('/api/alertas/1/acoes')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST + GET confirma persistência da ação', async () => {
        await request(app)
            .post('/api/alertas/1/acoes')
            .set('Authorization', `Bearer ${token}`)
            .send({ descricao: 'Consulta agendada' });

        const res = await request(app)
            .get('/api/alertas/1/acoes')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].descricao).toBe('Consulta agendada');
        expect(res.body[0]).toHaveProperty('medicoNome');
    });

    test('alerta inexistente → 404', async () => {
        const res = await request(app)
            .get('/api/alertas/9999/acoes')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('erro');
    });

    test('sem token → 401', async () => {
        const res = await request(app).get('/api/alertas/1/acoes');
        expect(res.status).toBe(401);
    });

});

// ─── Submissão CARAT ──────────────────────────────────────────────
describe('POST /patients/:id/carat', () => {

    test('submissão válida → 201 + scores corretos', async () => {
        const res = await request(app)
            .post('/patients/1/carat')
            .set('Authorization', `Bearer ${tokenUtente}`)
            .send({ respostas: [2, 2, 2, 2, 3, 3, 3, 3, 3, 3] });

        expect(res.status).toBe(201);
        expect(res.body.scores.scoreRinite).toBe(8);
        expect(res.body.scores.scoreAsma).toBe(18);
        expect(res.body.scores.scoreTotal).toBe(26);
    });

    test('sem token → 401', async () => {
        const res = await request(app)
            .post('/patients/1/carat')
            .send({ respostas: [2, 2, 2, 2, 3, 3, 3, 3, 3, 3] });
        expect(res.status).toBe(401);
    });

    test('respostas fora do intervalo → 400', async () => {
        const res = await request(app)
            .post('/patients/1/carat')
            .set('Authorization', `Bearer ${tokenUtente}`)
            .send({ respostas: [0, 1, 2, 3, 0, 1, 2, 3, 0, 99] }); // 99 inválido
        expect(res.status).toBe(400);
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

    test('alerta fechado não pode ser reaberto como Novo', async () => {
        const info = db.prepare(`INSERT INTO alerta (utenteId, medicoId, avaliacaoCaratId, tipo, prioridade, estado, motivo, atualizadoEm, criadoEm) VALUES (?,?,?,?,?,?,?,?,?)`)
            .run(1, 1, null, 'CONTROLO_INSUFICIENTE', 2, 'Fechado', 'Alerta já resolvido', '2026-05-02', '2026-05-02');

        const res = await request(app)
            .patch(`/api/alertas/${info.lastInsertRowid}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ novoEstado: 'Novo' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('erro', 'Não é possível reabrir um alerta fechado como Novo.');

        const alerta = db.prepare('SELECT estado FROM alerta WHERE id = ?').get(info.lastInsertRowid) as any;
        expect(alerta.estado).toBe('Fechado');
    });

});
