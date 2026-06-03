// URLs base do sistema 
const FHIR_BASE = 'https://saudinob.local/fhir';
const UTENTE_SYSTEM = `${FHIR_BASE}/CodeSystem/utente`;
const CARAT_SYSTEM = `${FHIR_BASE}/CodeSystem/carat`;

function formatarData(data: string | null | undefined): string {
    if (!data) return '';
    return new Date(data).toLocaleString('pt-PT', {
        timeZone: 'Europe/Lisbon',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function toPatientResource(utente: any, utilizador: any) {
    return {
        resourceType: 'Patient',
        id: `utente-${utente.id}`,

        // Identificador clínico — número de utente do SNS
        identifier: [
            {
                system: UTENTE_SYSTEM,
                value: String(utente.nUtente)
            }
        ],

        // Nome 
        name: utilizador?.nome
            ? [{ text: utilizador.nome }]
            : [],

        // Género
        gender: utente.genero === 'masculino' ? 'male'
            : utente.genero === 'feminino' ? 'female'
            : 'unknown',

        // Data de nascimento
        birthDate: utente.dataNascimento ?? undefined,

        // Telefone
        telecom: utente.telefone
            ? [{ system: 'phone', value: String(utente.telefone) }]
            : [],

        // Morada
        address: utente.morada
            ? [{ text: utente.morada }]
            : [],
    };
}

export function mapPatient(resource: any) {
    return {
        id: resource.id,
        nUtente: resource.identifier?.[0]?.value || '',
        nome: resource.name?.[0]?.text || '',
        gender: resource.gender || 'unknown',
        birthDate: resource.birthDate || '',
        telefone: resource.telecom?.[0]?.value || '',
        morada: resource.address?.[0]?.text || '',
    };
}

export function mapUtenteToFHIRPatient(utente: any, utilizador: any) {
    return mapPatient(toPatientResource(utente, utilizador));
}

export function toObservationResource(avaliacao: any) {
    return {
        resourceType: 'Observation',
        id: `carat-${avaliacao.id}`,

        status: 'final',

        code: {
            coding: [
                {
                    system: CARAT_SYSTEM,
                    code: 'CARAT-TOTAL',
                    display: 'CARAT total score'
                }
            ],
            text: 'Avaliação CARAT'
        },

        subject: {
            reference: `Patient/utente-${avaliacao.utenteId}`
        },

        effectiveDateTime: avaliacao.dataAvaliacao,

        // Score total como valor principal
        valueQuantity: {
            value: avaliacao.scoreTotal,
            unit: 'score',
            code: 'score'
        },

        component: [
            {
                code: { text: 'Score Asma' },
                valueInteger: avaliacao.scoreAsma
            },
            {
                code: { text: 'Score Rinite' },
                valueInteger: avaliacao.scoreRinite
            }
        ],

        // Observações textuais se existirem
        note: avaliacao.observacoes
            ? [{ text: avaliacao.observacoes }]
            : []
    };
}

export function mapObservation(resource: any) {
    return {
        id: resource.id,
        status: resource.status,
        code: resource.code?.coding?.[0]?.code || '',
        display: resource.code?.coding?.[0]?.display || resource.code?.text || '',
        scoreTotal: resource.valueQuantity?.value ?? '',
        scoreAsma: resource.component?.[0]?.valueInteger ?? '',
        scoreRinite: resource.component?.[1]?.valueInteger ?? '',
        effectiveDateTime: resource.effectiveDateTime || '',
        subject: resource.subject?.reference || ''
    };
}

export function mapObservationHumanData(resource: any) {
    return {
        ...mapObservation(resource),
        effectiveDateTime: formatarData(resource.effectiveDateTime)
    };
}

export function mapCaratAvaliacao(avaliacao: any, humanDate = false) {
    const resource = toObservationResource(avaliacao);
    return humanDate ? mapObservationHumanData(resource) : mapObservation(resource);
}

export { FHIR_BASE, UTENTE_SYSTEM, CARAT_SYSTEM };