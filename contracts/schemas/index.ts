export const loginSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
} as const;

export const submeterCaratSchema = {
    type: 'object',
    required: ['respostas'],
    properties: {
        respostas: {
            type: 'array',
            minItems: 10,
            maxItems: 10,
            items: { type: 'integer', minimum: 0, maximum: 3 }
        }
    },
    additionalProperties: false
} as const;

export const submeterSintomaSchema = {
    type: 'object',
    required: ['descricao', 'gravidade', 'dataInicioSintoma', 'tipo'],
    properties: {
        descricao: { type: 'string', minLength: 1 },
        gravidade: { type: 'integer', minimum: 1, maximum: 3 },
        dataInicioSintoma: { type: 'string', format: 'date' },
        tipo: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
} as const;

export const submeterMedicacaoSchema = {
    type: 'object',
    required: ['nome', 'dose', 'dataInicio'],
    properties: {
        nome: { type: 'string', minLength: 1 },
        dose: { type: 'string', minLength: 1 },
        dataInicio: { type: 'string', format: 'date' },
        dataFim: { type: ['string', 'null'], format: 'date' }
    },
    additionalProperties: false
} as const;

export const submeterExameSchema = {
    type: 'object',
    required: ['tipoExameId', 'data'],
    properties: {
        tipoExameId: { type: 'integer', minimum: 1 },
        data: { type: 'string', format: 'date' },
        resultado: { type: ['string', 'null'] },
        observacoes: { type: ['string', 'null'] }
    },
    additionalProperties: false
} as const;

export const atualizarEstadoAlertaSchema = {
    type: 'object',
    required: ['novoEstado'],
    properties: {
        novoEstado: { type: 'string', enum: ['Novo', 'Visto', 'Em_Seguimento', 'Fechado'] }
    },
    additionalProperties: false
} as const;

export const adicionarAcaoAlertaSchema = {
    type: 'object',
    required: ['descricao'],
    properties: {
        descricao: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
} as const;

export const criarNotaSchema = {
    type: 'object',
    required: ['conteudo'],
    properties: {
        titulo: { type: 'string', minLength: 1, maxLength: 255 },
        conteudo: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
} as const;
