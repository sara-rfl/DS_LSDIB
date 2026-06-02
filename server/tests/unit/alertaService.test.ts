import {
    regra1_controloInsuficiente,
    regra2_deterioracaoClinica,
    regra3_revisaoTerapeutica,
    regra4_indicacaoExame
} from '../../src/services/alertaService';

// ─── Regra 1: Controlo Insuficiente ──────────────────────────────
describe('regra1_controloInsuficiente', () => {

    test('Utente B (rinite=3, asma=7) → ambos descontrolados → true', () => {
        expect(regra1_controloInsuficiente(3, 7)).toBe(true);
    });

    test('Utente C avaliação 1 (rinite=12, asma=18) → ambos controlados → false', () => {
        expect(regra1_controloInsuficiente(12, 18)).toBe(false);
    });

    test('Utente A avaliação 1 (rinite=8, asma=18) → rinite no limite exato → true', () => {
        expect(regra1_controloInsuficiente(8, 18)).toBe(true);
    });

});

// ─── Regra 2: Deterioração Clínica ───────────────────────────────
describe('regra2_deterioracaoClinica', () => {

    test('Utente A: avaliação 2→3 (17→6, delta=4): queda de 11 → true', () => {
        expect(regra2_deterioracaoClinica(6, 17, 4)).toBe(true);
    });

    test('Utente C: avaliação 1→2 (30→28, delta=4): queda de 2 → false', () => {
        expect(regra2_deterioracaoClinica(28, 30, 4)).toBe(false);
    });

    test('Utente A: avaliação 1→2 (26→17, delta=4): queda de 9 → true', () => {
        expect(regra2_deterioracaoClinica(17, 26, 4)).toBe(true);
    });

});

// ─── Regra 3: Revisão Terapêutica ────────────────────────────────
describe('regra3_revisaoTerapeutica', () => {

    test('Utente D: tem sintoma + medicação ativa → true', () => {
        expect(regra3_revisaoTerapeutica(true, true)).toBe(true);
    });

    test('Utente C: sem sintoma + sem medicação ativa → false', () => {
        expect(regra3_revisaoTerapeutica(false, false)).toBe(false);
    });

    test('tem sintoma mas sem medicação → false', () => {
        expect(regra3_revisaoTerapeutica(true, false)).toBe(false);
    });

});

// ─── Regra 4: Indicação para Exame ───────────────────────────────
describe('regra4_indicacaoExame', () => {

    test('Utente D (score=6), limiar=15 → abaixo do limiar → true', () => {
        expect(regra4_indicacaoExame(6, 15)).toBe(true);
    });

    test('Utente C (score=30), limiar=15 → acima do limiar → false', () => {
        expect(regra4_indicacaoExame(30, 15)).toBe(false);
    });

    test('Utente B (score=10), limiar=10 → igual ao limiar → true', () => {
        expect(regra4_indicacaoExame(10, 10)).toBe(true);
    });

});