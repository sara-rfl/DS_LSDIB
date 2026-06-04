# iCARAT — Sistema de Prevenção e Acompanhamento de Doenças Crónicas

Projeto desenvolvido no âmbito da disciplina de **Desenvolvimento de Software em Saúde (DSS)** — FMUP.

API REST com arquitetura **MVC + Service + Repository**, construída com Node.js, Express e TypeScript, utilizando **SQLite** (`better-sqlite3`) como base de dados e **JWT** para autenticação. O frontend é servido diretamente pelo Express como ficheiros HTML/JS/CSS estáticos.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18 — verificar com `node -v`
- npm — verificar com `npm -v`

---

## Instalação

```bash
# Na raiz do repositório
npm run install:all
```

Isto instala as dependências da raiz e da pasta `server/`.

---

## Base de Dados

A base de dados é um ficheiro SQLite criado localmente. É necessário inicializá-la antes de correr o servidor pela primeira vez, ou sempre que se quiser repor os dados de origem.

```bash
cd server

# Apagar a base de dados existente (se houver)
rm -f db/database.db

# Criar as tabelas e popular com dados de seed
npx ts-node db/initDatabase.ts
```

O script cria todas as tabelas e insere utilizadores, utentes, médicos, medicação, avaliações CARAT, alertas e limiares de configuração pré-definidos.

---

## Correr o Servidor

```bash
cd server
npm run dev
```

O servidor fica disponível em **http://localhost:3000** (modo de desenvolvimento com auto-reload via nodemon).

Para aceder ao frontend, abrir diretamente no browser o ficheiro `client/src/views/login.html`. As páginas fazem chamadas à API em `http://localhost:3000`, por isso o servidor tem de estar a correr.

Para produção:

```bash
npm run build   # compila TypeScript para dist/
npm start       # corre dist/app.js
```

---

## Credenciais de Teste (Seed)

Após inicializar a base de dados, os seguintes utilizadores estão disponíveis:

| Perfil | Email | Password |
|--------|-------|----------|
| admin | admin.suporte@clinic.pt | password789 |
| medico | pedrocunha@clinic.pt | password123 |
| medico | marianapinto@clinic.pt | password234 |
| utente | mariasilva@clinic.pt | password345 |
| utente | jorgegoncalvez@clinic.pt | password456 |
| utente | paulajacinto@clinic.pt | password567 |
| utente | rosasantos@clinic.pt | password678 |

O login devolve um **JWT**. Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <token>
```

---

## Testes Automatizados

Os testes correm a partir da pasta `server/`:

```bash
cd server
npm test
```

Usa uma base de dados separada (`tests/test.db`) que é criada e destruída automaticamente — não afeta os dados de desenvolvimento.

### Testes unitários

| Ficheiro | O que testa |
|---|---|
| `tests/unit/caratService.test.ts` | `calcularScores`, `interpretarNiveis`, `verificarDeterioracao`, `gerarRecomendacoes` |
| `tests/unit/alertaService.test.ts` | `regra1_controloInsuficiente`, `regra2_deterioracaoClinica`, `regra3_revisaoTerapeutica`, `regra4_indicacaoExame` |

### Testes de integração

| Ficheiro | O que testa |
|---|---|
| `tests/integration/api.test.ts` | Login (credenciais válidas e inválidas), submissão CARAT com verificação de scores, listagem de alertas com e sem token, e validação de estado de alerta |

---

## Postman

A collection está em `postman/iCARAT.postman_collection.json`.

Para usar:
1. Importar o ficheiro no Postman.
2. Fazer **POST `/auth/login`** com um dos pares email/password acima — o token é devolvido no campo `token` do corpo da resposta.
3. Copiar o token e usar nas restantes requests com o header:
   `Authorization: Bearer <token>`.
4. Na collection já existem variáveis de ambiente para cada perfil:
   - `{{tokenAdmin}}` para admin
   - `{{tokenMedico}}` para médico
   - `{{tokenUtente}}` para utente

A collection cobre: Auth, Utentes, Médicos, CARAT, Alertas, FHIR e Config.

---

## Endpoints da API

### Autenticação

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| POST | `/auth/login` | — | Login; devolve JWT e perfil |

### Utentes

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/patients` | medico, admin | Listar todos os utentes |
| POST | `/patients` | admin | Criar utente |
| GET | `/patients/:id` | medico, admin, utente | Obter utente por ID |
| PUT | `/patients/:id` | admin | Atualizar utente |
| DELETE | `/patients/:id` | admin | Eliminar utente |

### Médicos

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/doctors` | admin | Listar médicos |
| POST | `/doctors` | admin | Criar médico |
| GET | `/doctors/:id` | admin | Obter médico por ID |
| PUT | `/doctors/:id` | admin | Atualizar médico |
| DELETE | `/doctors/:id` | admin | Eliminar médico |

### Utilizadores

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/users` | admin | Listar utilizadores |
| DELETE | `/users/:id` | admin | Eliminar utilizador |
| PATCH | `/users/:id/role` | admin | Alterar perfil do utilizador |

### Avaliação CARAT

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| POST | `/patients/:id/carat` | utente | Submeter avaliação CARAT (10 respostas, valores 0–3) |
| GET | `/patients/:id/carat` | utente, medico, admin | Histórico de avaliações do utente |
| GET | `/carat/:evalId` | utente, medico, admin | Obter avaliação específica |

### Sintomas

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/patients/:id/sintomas` | utente, medico | Listar sintomas do utente |
| POST | `/patients/:id/sintomas` | utente, medico | Registar sintoma |

### Medicação

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/patients/:id/medicacao` | medico, utente | Listar medicação do utente |
| POST | `/patients/:id/medicacao` | medico | Adicionar medicação |
| PUT | `/medicacao/:medicacaoId` | medico | Atualizar medicação |
| DELETE | `/medicacao/:medicacaoId` | medico | Eliminar medicação |

### Exames

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/tipoExame` | medico | Listar tipos de exame disponíveis |
| GET | `/patients/:id/exame` | medico, utente | Listar exames do utente |
| POST | `/patients/:id/exame` | medico | Solicitar exame |
| PUT | `/exame/:exameId` | medico | Atualizar exame |
| DELETE | `/exame/:exameId` | medico | Eliminar exame |

### Notas Clínicas

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/patients/:id/notas` | medico, admin | Listar notas do utente |
| POST | `/patients/:id/notas` | medico | Adicionar nota clínica |

### Alertas

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/api/alertas` | medico | Listar todos os alertas |
| GET | `/api/alertas/:id` | medico | Obter alerta por ID |
| PATCH | `/api/alertas/:id` | medico | Atualizar estado do alerta |
| POST | `/api/alertas/:id/acoes` | medico | Adicionar ação a alerta |
| GET | `/patients/:id/alertas` | medico | Alertas de um utente |
| GET | `/doctors/:id/alerts` | medico, admin | Alertas de um médico |
| POST | `/patients/:id/pedido-carat` | medico | Criar pedido de avaliação CARAT ao utente |
| GET | `/patients/:id/pedido-carat` | utente | Verificar se existe pedido de avaliação pendente |

### Configuração (Limiares)

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/config` | admin | Obter limiares do sistema |
| PUT | `/config` | admin | Atualizar limiares |

### Auditoria

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/auditoria` | admin | Listar registos de auditoria |
| DELETE | `/auditoria` | admin | Limpar registos de auditoria |

### FHIR (Interoperabilidade)

| Método | URL | Perfil | Descrição |
|--------|-----|--------|-----------|
| GET | `/fhir/Patient` | medico, admin | Bundle FHIR com todos os utentes |
| GET | `/fhir/Patient/:id` | medico, admin | Recurso FHIR Patient por ID |
| GET | `/fhir/Observation/:id` | medico, admin | Recurso FHIR Observation por ID |
| GET | `/fhir/Patient/:id/Observation` | medico, admin | Bundle FHIR de Observations do utente |

---

## Estrutura do Projeto

```
DS_LSDIB/
├── server/
│   ├── src/
│   │   ├── app.ts               # entrada da aplicação Express
│   │   ├── config/              # ligação à base de dados SQLite
│   │   ├── routes/              # definição dos endpoints REST
│   │   ├── controllers/         # recebe pedidos HTTP, delega nos services
│   │   ├── services/            # lógica de negócio (CARAT, alertas, regras)
│   │   ├── mappers/             # conversão para formato FHIR
│   │   └── middleware/          # autenticação JWT, autorização por perfil,
│   │                            # auditoria, validação de schema, logging
│   ├── db/
│   │   ├── initDatabase.ts      # script de inicialização (migrations + seeds)
│   │   ├── migrations/          # criação das tabelas (profiles, med, system, audit)
│   │   └── seeds/               # dados de exemplo (utilizadores, alertas, limiares)
│   ├── tests/
│   │   ├── unit/                # testes às funções de negócio isoladas
│   │   ├── integration/         # testes HTTP end-to-end com supertest
│   │   └── helpers/             # configuração do ambiente de teste
├── client/
│   └── src/
│       ├── views/               # páginas HTML (login, dashboard, CARAT, alertas, ...)
│       ├── pages/               # lógica JavaScript por página
│       ├── services/            # chamadas à API REST
│       └── styles/              # CSS
├── contracts/
│   └── schemas/                 # JSON schemas de validação dos payloads
├── postman/
│   └── iCARAT.postman_collection.json
└── README.md
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Node.js + Express | Servidor HTTP e API REST |
| TypeScript | Tipagem estática |
| SQLite (`better-sqlite3`) | Base de dados persistente em ficheiro local |
| JWT (`jsonwebtoken`) | Autenticação stateless |
| bcryptjs | Hash de passwords |
| AJV | Validação de payloads via JSON Schema |
| Jest + ts-jest | Testes unitários e de integração |
| Supertest | Testes HTTP de integração |
| nodemon + ts-node | Desenvolvimento com auto-reload |
