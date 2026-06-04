import { calcularScores, interpretarNiveis, verificarDeterioracao, gerarRecomendacoes } from '../../src/services/caratService';

// ─── calcularScores ───────────────────────────────────────────────
describe('calcularScores', () => {

    test('todas as respostas a 0 → scores todos 0', () => {
        const resultado = calcularScores([0,0,0,0, 0,0,0,0,0,0]);
        expect(resultado.scoreRinite).toBe(0);
        expect(resultado.scoreAsma).toBe(0);
        expect(resultado.scoreTotal).toBe(0);
    });

    test('todas as respostas a 3 → score máximo', () => {
        const resultado = calcularScores([3,3,3,3, 3,3,3,3,3,3]);
        expect(resultado.scoreRinite).toBe(12);
        expect(resultado.scoreAsma).toBe(18);
        expect(resultado.scoreTotal).toBe(30);
    });

    test('avaliação 1 do Utente A → rinite=8, asma=18, total=26', () => {
        const resultado = calcularScores([2,2,2,2, 3,3,3,3,3,3]);
        expect(resultado.scoreRinite).toBe(8);
        expect(resultado.scoreAsma).toBe(18);
        expect(resultado.scoreTotal).toBe(26);
    });

});

// ─── interpretarNiveis ────────────────────────────────────────────
describe('interpretarNiveis', () => {

    test('Utente A avaliação 1 → NÃO CONTROLADO', () => {
        const resultado = interpretarNiveis(8, 15, 23);
        expect(resultado.geral).toBe('NÃO CONTROLADO');
        expect(resultado.rinite).toBe('Rinite Não Controlada');
        expect(resultado.asma).toBe('Asma Não Controlada');
    });

    test('Utente B → NÃO CONTROLADO', () => {
        const resultado = interpretarNiveis(3, 7, 10);
        expect(resultado.geral).toBe('NÃO CONTROLADO');
        expect(resultado.rinite).toBe('Rinite Não Controlada');
        expect(resultado.asma).toBe('Asma Não Controlada');
    });

    test('Utente C → score máximo → CONTROLADO', () => {
        const resultado = interpretarNiveis(12, 18, 30);
        expect(resultado.geral).toBe('CONTROLADO');
        expect(resultado.rinite).toBe('Rinite Controlada');
        expect(resultado.asma).toBe('Asma Controlada');
    });

});

// ─── verificarDeterioracao ────────────────────────────────────────
describe('verificarDeterioracao', () => {

    test('Utente A: de 26 para 6 com delta 5 → deteriorou', () => {
        const resultado = verificarDeterioracao(
            { scoreTotal: 6 },
            { scoreTotal: 26 },
            5
        );
        expect(resultado).toBe(true);
    });

    test('Utente C: de 30 para 28 com delta 5 → não deteriorou', () => {
        const resultado = verificarDeterioracao(
            { scoreTotal: 28 },
            { scoreTotal: 30 },
            5
        );
        expect(resultado).toBe(false);
    });

});

// ─── gerarRecomendacoes ───────────────────────────────────────────
describe('gerarRecomendacoes', () => {

    test('geral CONTROLADO → manter medicação e monitorizar', () => {
        const resultado = gerarRecomendacoes({ geral: 'CONTROLADO', rinite: 'Rinite Controlada', asma: 'Asma Controlada' });
        expect(resultado).toContain('Manter Medicação Atual');
        expect(resultado).toContain('Continuar a Monitorizar');
    });

    test('rinite não controlada + asma controlada → avisar médico nasal', () => {
        const resultado = gerarRecomendacoes({ geral: 'NÃO CONTROLADO', rinite: 'Rinite Não Controlada', asma: 'Asma Controlada' });
        expect(resultado).toContain('Evitar Alergénios');
        expect(resultado).toContain('Considerar Revisão da Medicação Nasal');
    });

    test('asma não controlada → urgência respiratória', () => {
        const resultado = gerarRecomendacoes({ geral: 'NÃO CONTROLADO', rinite: 'Rinite Não Controlada', asma: 'Asma Não Controlada' });
        expect(resultado).toContain('Não Fazer Esforço Físico');
        expect(resultado).toContain('Usar Medicação de Resgate se Necessário');
    });

});
