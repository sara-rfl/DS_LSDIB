import db from '../config/database';
import {
    toPatientResource,
    mapPatient,
    toObservationResource,
    mapObservation,
    mapCaratAvaliacao
} from '../mappers/fhirMapper';

export function getFHIRPatient(utenteId: number) {
    const utente = db.prepare(`
        SELECT u.*, ut.nome, ut.email
        FROM utente u
        JOIN utilizador ut ON ut.id = u.utilizadorId
        WHERE u.id = ?
    `).get(utenteId) as any;

    if (!utente) {
        const erro: any = new Error('Utente não encontrado');
        erro.status = 404;
        throw erro;
    }

    return toPatientResource(utente, { nome: utente.nome, email: utente.email });
}

export function getFHIRPatientBundle() {
    const utentes = db.prepare(`
        SELECT u.*, ut.nome, ut.email
        FROM utente u
        JOIN utilizador ut ON ut.id = u.utilizadorId
    `).all() as any[];

    return {
        resourceType: 'Bundle',
        type: 'searchset',
        total: utentes.length,
        entry: utentes.map(u => ({
            resource: toPatientResource(u, { nome: u.nome, email: u.email })
        }))
    };
}


export function getFHIRObservation(avaliacaoId: number) {
    const avaliacao = db.prepare(`
        SELECT * FROM avaliacaoCarat WHERE id = ?
    `).get(avaliacaoId) as any;

    if (!avaliacao) {
        const erro: any = new Error('Avaliação não encontrada');
        erro.status = 404;
        throw erro;
    }

    return toObservationResource(avaliacao);
}

export function getFHIRObservationBundle(utenteId: number) {
    const avaliacoes = db.prepare(`
        SELECT * FROM avaliacaoCarat WHERE utenteId = ? ORDER BY dataAvaliacao DESC
    `).all(utenteId) as any[];

    return {
        resourceType: 'Bundle',
        type: 'searchset',
        total: avaliacoes.length,
        entry: avaliacoes.map(a => ({
            resource: toObservationResource(a)
        }))
    };
}

export function getFHIRPatientSimple(utenteId: number) {
    const utente = db.prepare(`
        SELECT u.*, ut.nome, ut.email
        FROM utente u
        JOIN utilizador ut ON ut.id = u.utilizadorId
        WHERE u.id = ?
    `).get(utenteId) as any;

    if (!utente) {
        const erro: any = new Error('Utente não encontrado');
        erro.status = 404;
        throw erro;
    }

    return mapPatient(toPatientResource(utente, { nome: utente.nome }));
}

export function getFHIRObservationSimple(avaliacaoId: number) {
    const avaliacao = db.prepare(`
        SELECT * FROM avaliacaoCarat WHERE id = ?
    `).get(avaliacaoId) as any;

    if (!avaliacao) {
        const erro: any = new Error('Avaliação não encontrada');
        erro.status = 404;
        throw erro;
    }

    // humanDate = true → data formatada em português
    return mapCaratAvaliacao(avaliacao, true);
}