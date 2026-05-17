# DS_LSDIB - Sistema de Prevenção e Acompanhamento de Doenças Crónicas (Node + Express + TypeScript + React)

Projeto desenvolvido no âmbito da disciplina de **Desenvolvimento de Software em Saúde (DSS)** — FMUP.


Implementação de uma API REST seguindo o padrão **MVC + Service** com Node.js, Express e TypeScript, utilizando **TypeORM** como ORM e **PostgreSQL** como base de dados persistente. Inclui um frontend em React que serve como camada **View** da arquitetura MVC.

## Estrutura do Projeto

(Possíveis mudanças futuras)
DS_LSDIB/
├── server/
│   ├── src/
│   │   ├── routes/          # endpoints REST
│   │   ├── controllers/     # lógica de cada rota
│   │   ├── services/        # lógica de negócio (CARAT, alertas)
│   │   ├── models/          # entidades / acesso à BD
│   │   ├── middleware/       # auth, validação, logs
│   │   └── config/          # limiares, variáveis de ambiente
│   ├── db/
│   │   ├── migrations/       # criação das tabelas
│   │         ├── tablesProfiles/   # criação das tabelas para os perfis
│   │         ├── tablesMed/        # criação das tabelas para os Avaliação CARAT, Sintoma,    Medicação e Exame
│   │         ├── tablesSystem/     # criação das tabelas para os configurações de Sistema
│   │   └── seeds/            # dados simulados
│   └── tests/
│       ├── unit/
│       └── integration/
├── client/
│   └── src/
│       ├── pages/           # uma pasta por perfil
│       ├── components/
│       └── services/        # chamadas à API
├── contracts/
│   └── schemas/             # JSON schemas dos payloads
├── .env.example
├── .gitignore
├── README.md
└── postman_collection.json

## Pré-requisitos

- [Node.js](https://nodejs.org/) (verificar com `node -v`)
- npm (verificar com `npm -v`)
- npm run install:all


#Setup Base de Dados

npm install better-sqlite3
npm install -D @types/better-sqlite3

npm install 

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/Informatica-MEDCIDS/DSS-MVC.git
cd DSS-MVC

# Instalar dependências
npm install
```

## Como Correr

### Modo de desenvolvimento (com auto-reload)

```bash
npx nodemon src/app.ts
```

### Compilar para produção

```bash
npx tsc
node dist/app.js
```


### Desenvolvimento com base de dados
> Em cada nova sessão que seja necessário correr a base de dados, após uma primeira execução é necessário correr os seguintes comandos nesta ordem:

rm server/db/database.db
npx ts-node db/initDatabase.ts


> O servidor arranca em **<http://localhost:3000>**

> A interface React fica disponível em **<http://localhost:3000>** (mesma porta — servida directamente pelo Express)

> O ficheiro `data.db` é criado automaticamente na primeira execução com registos iniciais de exemplo.

## Endpoints da API

**FAZER ALTERAÇÕES**

| Método | URL               | Descrição                         |
|--------|-------------------|-----------------------------------|
| GET    | `/prescricoes`    | Listar todas as prescrições       |
| POST   | `/prescricoes`    | Criar uma nova prescrição         |
| GET    | `/pedidos-exames` | Listar todos os pedidos de exames |
| POST   | `/pedidos-exames` | Criar um novo pedido de exame     |
| GET    | `/exames`         | Alias para listar exames          |
| POST   | `/exames`         | Alias para criar exame            |



**Ver exemplos no projeto do professor**
## Regras de Exames

## Arquitetura MVC + Service

### Fluxo completo (View → Controller → Service → ORM → BD)

## Tecnologias

- **Node.js** — Runtime JavaScript
- **Express** — Framework web para criação de APIs REST
- **TypeScript** — Superset de JavaScript com tipagem estática
- **TypeORM** — ORM com mapeamento via decoradores TypeScript
- **SQLite** (`better-sqlite3`) — Base de dados relacional persistente em ficheiro
- **React 18** — Biblioteca para construção da interface (carregada via CDN)
- **nodemon** — Auto-reload em desenvolvimento
- **ts-node** — Execução direta de TypeScript sem compilação prévia


###Scripts e Comandos

  Script | Comando           | Uso                         |
|--------|-------------------|-----------------------------------|
| dev    | npm run dev       | Desenvolvimento                   |
| build  | npm run build     | Compilar TypeScript               |
| start  | npm start         | Produção |
