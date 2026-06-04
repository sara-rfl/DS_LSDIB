"use strict";

let chartCarat = null;

const token = localStorage.getItem('token');
const utenteId = localStorage.getItem('utenteId');
if (!token || !utenteId) {
    window.location.href = 'login.html';
}
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// NAVEGAÇÃO POR SIDEBAR
const todasSeccoes = ['inicio', 'perfil', 'sintomas', 'medicacao', 'exames', 'carat-escolha', 'carat', 'hist-carat'];

function mostrarSeccao(id, menuId) {
    todasSeccoes.forEach(s => {
        const el = document.getElementById(`seccao-${s}`);
        if (el) el.style.display = 'none';
    });
    const alvo = document.getElementById(`seccao-${id}`);
    if (alvo) alvo.style.display = 'block';

    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    const menuAlvo = document.getElementById(menuId || `menu-${id}`);
    if (menuAlvo) menuAlvo.classList.add('active');
}

document.getElementById('menu-inicio')?.addEventListener('click', () => mostrarSeccao('inicio', 'menu-inicio'));
document.getElementById('menu-perfil')?.addEventListener('click', () => { mostrarSeccao('perfil', 'menu-perfil'); carregarDadosPerfil(); });
document.getElementById('menu-sintomas')?.addEventListener('click', () => { mostrarSeccao('sintomas', 'menu-sintomas'); carregarSintomas(); });
document.getElementById('menu-medicacao')?.addEventListener('click', () => { mostrarSeccao('medicacao', 'menu-medicacao'); carregarMedicacao(); });
document.getElementById('menu-exames')?.addEventListener('click', () => { mostrarSeccao('exames', 'menu-exames'); carregarExamesUtente(); });
document.getElementById('btn-ir-exames-banner')?.addEventListener('click', () => { mostrarSeccao('exames', 'menu-exames'); carregarExamesUtente(); });
document.getElementById('menu-carat')?.addEventListener('click', () => mostrarSeccao('carat-escolha', 'menu-carat'));

// Página de escolha CARAT
document.getElementById('btn-escolha-novo')?.addEventListener('click', () => mostrarSeccao('carat', 'menu-carat'));
document.getElementById('btn-escolha-historico')?.addEventListener('click', () => { mostrarSeccao('hist-carat', 'menu-carat'); carregarHistoricoCarat(); });

// Botões "← Voltar" dentro das secções CARAT
document.querySelectorAll('.btn-voltar-carat').forEach(btn => {
    btn.addEventListener('click', () => mostrarSeccao('carat-escolha', 'menu-carat'));
});

// Cards de resumo clicáveis
document.getElementById('resumo-carat')?.addEventListener('click', () => { mostrarSeccao('hist-carat', 'menu-carat'); carregarHistoricoCarat(); });
document.getElementById('resumo-medicacao')?.addEventListener('click', () => { mostrarSeccao('medicacao', 'menu-medicacao'); carregarMedicacao(); });
document.getElementById('resumo-sintomas')?.addEventListener('click', () => { mostrarSeccao('sintomas', 'menu-sintomas'); carregarSintomas(); });



// WELCOME HEADER + RESUMO
async function carregarInicio() {
    if (!utenteId) return;
    renderRecomendacoesInicio();
    const nome = localStorage.getItem('nome') || '—';
    const iniciais = nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    const navNome = document.getElementById('nav-nome');
    if (navNome) navNome.textContent = nome;

    const avatar = document.getElementById('welcome-avatar');
    if (avatar) avatar.textContent = iniciais;
    const welcomeNome = document.getElementById('welcome-nome');
    if (welcomeNome) welcomeNome.textContent = `Olá, ${nome}`;

    try {
        const u = await fetch(`http://localhost:3000/patients/${utenteId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (u.ok) {
            const dados = await u.json();
            const sub = document.getElementById('welcome-sub');
            if (sub) sub.textContent = `Nº Utente: ${dados.nUtente || '—'} · Médico: Dr(a). ${dados.medicoNome || 'Não atribuído'}`;
        }
    } catch {}

    // Resumo CARAT
    try {
        const rc = await fetch(`http://localhost:3000/patients/${utenteId}/carat`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (rc.ok) {
            const lista = await rc.json();
            const val = document.getElementById('resumo-carat-valor');
            const det = document.getElementById('resumo-carat-detalhe');
            if (lista.length > 0) {
                const ultimo = lista[0];
                const controlado = ultimo.scoreTotal > 24 || (ultimo.scoreRinite > 8 && ultimo.scoreAsma >= 16);
                if (val) val.innerHTML = controlado
                    ? `<span style="color:#065f46;">Controlado</span>`
                    : `<span style="color:#991b1b;">Não Controlado</span>`;
                if (det) det.textContent = `Score: ${ultimo.scoreTotal}/30 · ${new Date(ultimo.dataAvaliacao).toLocaleDateString('pt-PT')}`;
            } else {
                if (val) val.textContent = 'Sem avaliações';
                if (det) det.textContent = 'Clique para preencher o questionário';
            }
            renderAlertasInicio(lista);
        }
    } catch {}

    // Resumo Medicação
    try {
        const rm = await fetch(`http://localhost:3000/patients/${utenteId}/medicacao`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (rm.ok) {
            const lista = await rm.json();
            const hoje = new Date();
            const ativas = lista.filter(m => !m.dataFim || new Date(m.dataFim) >= hoje).length;
            const val = document.getElementById('resumo-med-valor');
            const det = document.getElementById('resumo-med-detalhe');
            if (val) val.textContent = ativas;
            if (det) det.textContent = ativas === 1 ? '1 medicação ativa' : `${ativas} medicações ativas`;
        }
    } catch {}

    // Banner + Resumo Exames Pendentes
    try {
        const re = await fetch(`http://localhost:3000/patients/${utenteId}/exame`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (re.ok) {
            const listaExames = await re.json();
            const pendentes = listaExames.filter(e => !e.resultado);
            if (pendentes.length > 0) {
                const banner = document.getElementById('banner-exames-pendentes');
                if (banner) {
                    banner.style.display = 'flex';
                    const countEl = document.getElementById('banner-exames-count');
                    if (countEl) countEl.textContent = pendentes.length;
                }
            }
        }
    } catch {}

    // Resumo Sintomas
    try {
        const rs = await fetch(`http://localhost:3000/patients/${utenteId}/sintomas`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (rs.ok) {
            const lista = await rs.json();
            const limite = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const recentes = lista.filter(s => new Date(s.dataRegisto) >= limite).length;
            const val = document.getElementById('resumo-sint-valor');
            const det = document.getElementById('resumo-sint-detalhe');
            if (val) val.textContent = recentes;
            if (det) det.textContent = 'nos últimos 30 dias';
        }
    } catch {}
}

async function carregarDadosPerfil() {
    const container = document.getElementById('conteudo-perfil');
    if (!container || !utenteId)
        return;
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!resposta.ok)
            throw new Error('Erro ao carregar perfil.');
        const dadosUtente = await resposta.json();
        container.innerHTML = `
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                <h2 style="text-align: center; margin-bottom: 24px; color: #1a1a2e;">Atualizar Dados Pessoais</h2>
                
                <form id="form-atualizar-perfil" style="display: flex; flex-direction: column; gap: 16px;">
                    
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Nome:</label>
                            <input type="text" id="perfil-nome" class="search-input" value="${dadosUtente.nome || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Email:</label>
                            <input type="email" id="perfil-email" class="search-input" value="${dadosUtente.email || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                    </div>
                    <small style="color: #888; text-align: center; margin-top: -10px; margin-bottom: 5px;">Campos de identidade bloqueados por motivos de segurança.</small>

                    <div>
                        <label style="font-weight: bold; font-size: 14px; color: #555;">Médico Responsável:</label>
                        <input type="text" id="perfil-medico" class="search-input" value="Dr(a). ${dadosUtente.medicoNome || 'Não atribuído'}" disabled style="width: 100%; background-color: #eff6ff; cursor: not-allowed; color: #1a73e8; font-weight: bold;">
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Nº de Utente:</label>
                            <input type="number" id="perfil-nutente" class="search-input" value="${dadosUtente.nUtente || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Data de Nascimento:</label>
                            <input type="date" id="perfil-nascimento" class="search-input" value="${dadosUtente.dataNascimento || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Telefone:</label>
                            <input type="tel" id="perfil-telefone" class="search-input" value="${dadosUtente.telefone || ''}" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Género:</label>
                            <select id="perfil-genero" class="search-input" style="width: 100%; cursor: pointer;">
                                <option value="feminino" ${dadosUtente.genero === 'feminino' ? 'selected' : ''}>Feminino</option>
                                <option value="masculino" ${dadosUtente.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style="font-weight: bold; font-size: 14px; color: #555;">Morada:</label>
                        <input type="text" id="perfil-morada" class="search-input" value="${dadosUtente.morada || ''}" style="width: 100%;">
                    </div>

                    <button type="submit" id="btn-guardar" style="background-color: #1a73e8; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; transition: all 0.2s; font-size: 15px; box-shadow: 0 4px 12px rgba(26,115,232,0.3);">
                        Guardar Alterações
                    </button>
                    <p id="mensagem-perfil" style="display: none; margin-top: 10px; font-weight: bold; text-align: center; padding: 10px; border-radius: 6px;"></p>
                </form>
            </div>
        `;
        const formAtualizar = document.getElementById('form-atualizar-perfil');
        const mensagemErro = document.getElementById('mensagem-perfil');
        if (formAtualizar) {
            formAtualizar.addEventListener('submit', async (evento) => {
                evento.preventDefault();
                const telefoneNovo = document.getElementById('perfil-telefone').value;
                const generoNovo = document.getElementById('perfil-genero').value;
                const moradaNova = document.getElementById('perfil-morada').value;
                try {
                    const respostaAtualizacao = await fetch(`http://localhost:3000/patients/${utenteId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            telefone: telefoneNovo,
                            genero: generoNovo,
                            morada: moradaNova
                        })
                    });
                    if (respostaAtualizacao.ok) {
                        mensagemErro.innerText = 'Dados atualizados com sucesso!';
                        mensagemErro.style.backgroundColor = '#d4edda';
                        mensagemErro.style.color = '#155724';
                        mensagemErro.style.display = 'block';
                    }
                    else {
                        mensagemErro.innerText = 'Erro ao guardar as alterações. Sem permissão.';
                        mensagemErro.style.backgroundColor = '#f8d7da';
                        mensagemErro.style.color = '#721c24';
                        mensagemErro.style.display = 'block';
                    }
                }
                catch (erroDeRede) {
                    mensagemErro.innerText = 'Erro de ligação ao servidor.';
                    mensagemErro.style.display = 'block';
                }
            });
        }
    }
    catch (erro) {
        console.error("Erro:", erro);
        container.innerHTML = '<h2>Atualizar Dados Pessoais</h2><p class="error-message" style="color: #e74c3c;">Erro ao ligar ao servidor. Verifica a ligação.</p>';
    }
}
async function carregarSintomas() {
    const container = document.getElementById('tabela-sintomas-container');
    if (!container || !utenteId)
        return;
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/sintomas`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok)
            throw new Error('Falha ao obter sintomas.');
        const sintomas = await resposta.json();
        if (sintomas.length === 0) {
            container.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border-radius: 6px;">Não existem sintomas registados no seu processo clínico.</p>';
            return;
        }
        let html = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <tr style="background-color: #f0f4f8; border-bottom: 2px solid #dcdcdc;">
                    <th style="padding: 12px;">Início do Sintoma</th>
                    <th style="padding: 12px;">Descrição</th>
                    <th style="padding: 12px;">Tipo</th>
                    <th style="padding: 12px;">Gravidade</th>
                </tr>
        `;
        sintomas.forEach((s) => {
            const dataCortada = s.dataInicioSintoma ? s.dataInicioSintoma.split(' ')[0] : 'N/A';
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px;">${dataCortada}</td>
                    <td style="padding: 12px; font-weight: bold;">${s.descricao || 'N/A'}</td>
                    <td style="padding: 12px;">${s.tipo || 'N/A'}</td>
                    <td style="padding: 12px;">Nível ${s.gravidade || 'N/A'}</td>
                </tr>
            `;
        });
        html += '</table>';
        container.innerHTML = html;
    }
    catch (erro) {
        container.innerHTML = '<p style="color: #e74c3c;">Os serviços clínicos não estão disponíveis de momento.</p>';
    }
}
async function carregarMedicacao() {
    const container = document.getElementById('tabela-medicacao-container');
    if (!container || !utenteId)
        return;
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/medicacao`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok)
            throw new Error('Falha ao obter medicação.');
        const medicacoes = await resposta.json();
        if (medicacoes.length === 0) {
            container.innerHTML = '<p style="padding: 15px; background-color: #f8f9fa; border-radius: 6px;">Não tem medicação ativa prescrita.</p>';
            return;
        }
        let html = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <tr style="background-color: #f0f4f8; border-bottom: 2px solid #dcdcdc;">
                    <th style="padding: 12px;">Fármaco</th>
                    <th style="padding: 12px;">Dose</th>
                    <th style="padding: 12px;">Duração (Frequência)</th>
                </tr>
        `;
        medicacoes.forEach((m) => {
            let duracaoTexto = "Uso Contínuo";
            if (m.dataInicio && m.dataFim) {
                const dataInicial = new Date(m.dataInicio).getTime();
                const dataFinal = new Date(m.dataFim).getTime();
                const diferencaMilissegundos = dataFinal - dataInicial;
                const diasTratamento = Math.ceil(diferencaMilissegundos / (1000 * 60 * 60 * 24));
                duracaoTexto = `${diasTratamento} dias`;
            }
            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px; font-weight: bold; color: #3498db;">${m.nome || 'N/A'}</td>
                    <td style="padding: 12px;">${m.dose || 'N/A'}</td>
                    <td style="padding: 12px;">${duracaoTexto}</td>
                </tr>
            `;
        });
        html += '</table>';
        container.innerHTML = html;
    }
    catch (erro) {
        container.innerHTML = '<p style="color: #e74c3c;">Os serviços clínicos não estão disponíveis de momento.</p>';
    }
}



async function carregarExamesUtente() {
    const container = document.getElementById('container-exames-utente');
    if (!container || !utenteId) return;
    try {
        const r = await fetch(`http://localhost:3000/patients/${utenteId}/exame`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!r.ok) throw new Error();
        const lista = await r.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Sem exames registados.</p>';
            return;
        }

        const pendentes = lista.filter(e => !e.resultado);
        const realizados = lista.filter(e => e.resultado);

        const renderTabela = (itens) => {
            if (itens.length === 0) return '<p class="estado-mensagem" style="padding:16px;">Nenhum.</p>';
            let html = `<table class="tabela-utentes"><thead><tr>
                <th>Tipo</th><th>Data</th><th>Resultado</th><th>Observações</th>
            </tr></thead><tbody>`;
            itens.forEach(e => {
                const data = e.data ? new Date(e.data).toLocaleDateString('pt-PT') : '—';
                const resultado = e.resultado
                    ? `<span style="font-size:13px;">${e.resultado}</span>`
                    : `<span style="background:#fff7ed;color:#c2410c;padding:2px 8px;border-radius:8px;font-size:12px;font-weight:600;">Pendente</span>`;
                html += `<tr>
                    <td><strong>${e.tipoExameNome || '—'}</strong></td>
                    <td>${data}</td>
                    <td style="max-width:220px;">${resultado}</td>
                    <td style="max-width:220px;font-size:13px;color:#6b7280;">${e.observacoes || '—'}</td>
                </tr>`;
            });
            return html + '</tbody></table>';
        };

        let html = '';
        if (pendentes.length > 0) {
            html += `
                <div style="padding:16px 20px 8px;display:flex;align-items:center;gap:10px;">
                    <span style="background:#fff7ed;color:#c2410c;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;">● Agendados (${pendentes.length})</span>
                </div>
                ${renderTabela(pendentes)}
            `;
        }
        if (realizados.length > 0) {
            html += `
                <div style="padding:${pendentes.length > 0 ? '20px' : '16px'} 20px 8px;display:flex;align-items:center;gap:10px;${pendentes.length > 0 ? 'border-top:1px solid #f3f4f6;' : ''}">
                    <span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;">✓ Realizados (${realizados.length})</span>
                </div>
                ${renderTabela(realizados)}
            `;
        }

        container.innerHTML = html;
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar exames.</p>';
    }
}

function interpretarScore(av) {
    const riniteOk = av.scoreRinite > 8;
    const asmaOk = av.scoreAsma >= 16;
    if (riniteOk && asmaOk) return 'Rinite e asma controladas';
    if (!riniteOk && !asmaOk) return 'Rinite e asma não controladas';
    if (!riniteOk) return 'Rinite não controlada';
    return 'Asma não controlada';
}

function analisarTendencia(lista) {
    if (lista.length < 2) return 'sem dados';
    const newest = lista[0].scoreTotal;
    const ref = lista[Math.min(2, lista.length - 1)].scoreTotal;
    const diff = newest - ref;
    if (diff <= -3) return 'piora';
    if (diff >= 3) return 'melhora';
    return 'estavel';
}

function renderGraficoCarat(lista) {
    const canvas = document.getElementById('grafico-carat');
    if (!canvas || lista.length === 0) return;
    if (chartCarat) { chartCarat.destroy(); chartCarat = null; }

    const cronologico = [...lista].reverse();
    const labels = cronologico.map(av => new Date(av.dataAvaliacao).toLocaleDateString('pt-PT'));
    const scores = cronologico.map(av => av.scoreTotal);

    chartCarat = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Score CARAT Total',
                    data: scores,
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26,115,232,0.08)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: scores.map(s => s > 24 ? '#16a34a' : '#dc2626'),
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                },
                {
                    label: 'Limiar de controlo (24/30)',
                    data: labels.map(() => 24),
                    borderColor: '#ef4444',
                    borderDash: [6, 4],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 30,
                    title: { display: true, text: 'Score Total (/30)' },
                    grid: { color: 'rgba(0,0,0,0.06)' }
                },
                x: {
                    title: { display: true, text: 'Data da Avaliação' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            if (ctx.datasetIndex === 0) {
                                return `Score: ${ctx.parsed.y}/30 — ${ctx.parsed.y > 24 ? 'Controlado' : 'Não controlado'}`;
                            }
                            return `Limiar: ${ctx.parsed.y}/30`;
                        }
                    }
                }
            }
        }
    });
}

function renderRecomendacoesInicio() {
    const container = document.getElementById('recomendacoes-inicio');
    if (!container) return;

    let dados;
    try { dados = JSON.parse(localStorage.getItem('ultimasRecomendacoes') || ''); } catch { return; }
    if (!dados || !dados.recomendacoes || dados.recomendacoes.length === 0) return;

    const data = new Date(dados.data).toLocaleDateString('pt-PT');
    container.innerHTML = `
        <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px 24px;">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
                <p style="font-weight:700;color:#1d4ed8;font-size:15px;margin:0;">Recomendações da última avaliação CARAT</p>
                <span style="font-size:12px;color:#6b7280;background:#dbeafe;padding:3px 10px;border-radius:20px;">${data}</span>
            </div>
            <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;">
                ${dados.recomendacoes.map(r => `<li style="font-size:13px;color:#1e3a5f;">${r}</li>`).join('')}
            </ul>
            <p style="font-size:12px;color:#9ca3af;margin-top:12px;margin-bottom:0;">Lembrete válido até à próxima avaliação.</p>
        </div>
    `;
}

function renderAlertasInicio(lista) {
    const container = document.getElementById('alertas-inicio');
    if (!container || !lista || lista.length === 0) return;

    const ultimo = lista[0];
    const controlado = ultimo.scoreTotal > 24 || (ultimo.scoreRinite > 8 && ultimo.scoreAsma >= 16);
    const tendencia = analisarTendencia(lista);

    const alertas = [];

    if (!controlado) {
        alertas.push({
            bg: '#fef2f2', borda: '#fca5a5', cor: '#dc2626',
            icone: '⚠',
            titulo: 'Doença não controlada',
            mensagem: `Último score CARAT: ${ultimo.scoreTotal}/30. ${interpretarScore(ultimo)}.`,
            acao: 'Contacte o seu médico para rever o plano de tratamento.'
        });
    }

    if (tendencia === 'piora') {
        alertas.push({
            bg: '#fff7ed', borda: '#fed7aa', cor: '#ea580c',
            icone: '↘',
            titulo: 'Tendência de agravamento',
            mensagem: 'Os seus scores CARAT têm vindo a diminuir nas últimas avaliações.',
            acao: 'Marque uma consulta de acompanhamento em breve.'
        });
    } else if (controlado && tendencia === 'melhora') {
        alertas.push({
            bg: '#f0fdf4', borda: '#86efac', cor: '#16a34a',
            icone: '↗',
            titulo: 'A melhorar',
            mensagem: `Score atual: ${ultimo.scoreTotal}/30. A sua doença está controlada e em melhoria.`,
            acao: 'Continue a cumprir o plano de tratamento prescrito.'
        });
    } else if (controlado) {
        alertas.push({
            bg: '#f0fdf4', borda: '#86efac', cor: '#16a34a',
            icone: '✓',
            titulo: 'Doença controlada',
            mensagem: `Score atual: ${ultimo.scoreTotal}/30. A sua doença está bem controlada.`,
            acao: 'Mantenha o tratamento e compareça às consultas de rotina.'
        });
    }

    container.innerHTML = alertas.map(a => `
        <div style="display:flex;align-items:flex-start;gap:14px;background:${a.bg};border:1.5px solid ${a.borda};border-radius:12px;padding:16px 20px;">
            <span style="font-size:20px;color:${a.cor};flex-shrink:0;margin-top:2px;">${a.icone}</span>
            <div>
                <p style="font-weight:700;color:${a.cor};margin-bottom:4px;">${a.titulo}</p>
                <p style="font-size:13px;color:#374151;margin-bottom:4px;">${a.mensagem}</p>
                <p style="font-size:13px;color:#6b7280;"><strong>O que fazer:</strong> ${a.acao}</p>
            </div>
        </div>
    `).join('');
}

async function carregarHistoricoCarat() {
    const container = document.getElementById('container-historico-carat');
    if (!container || !utenteId) return;
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/carat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const lista = await resposta.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Ainda não tens avaliações CARAT registadas.</p>';
            return;
        }

        renderGraficoCarat(lista);

        let html = `
            <table class="tabela-utentes">
                <thead><tr>
                    <th>Data</th>
                    <th>Score Rinite</th>
                    <th>Score Asma</th>
                    <th>Score Total</th>
                    <th>Interpretação</th>
                    <th>Estado</th>
                </tr></thead>
                <tbody>
        `;
        lista.forEach(av => {
            const data = av.dataAvaliacao ? new Date(av.dataAvaliacao).toLocaleDateString('pt-PT') : '—';
            const controlado = av.scoreTotal > 24 || (av.scoreRinite > 8 && av.scoreAsma >= 16);
            const badge = controlado
                ? `<span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Controlado</span>`
                : `<span style="background:#fef2f2;color:#991b1b;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Não Controlado</span>`;
            html += `
                <tr>
                    <td>${data}</td>
                    <td>${av.scoreRinite} / 12</td>
                    <td>${av.scoreAsma} / 18</td>
                    <td><strong>${av.scoreTotal} / 30</strong></td>
                    <td style="font-size:13px;color:#374151;">${interpretarScore(av)}</td>
                    <td>${badge}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar o histórico CARAT.</p>';
    }
}

const formCarat = document.getElementById('form-carat');
if (formCarat) {
    formCarat.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const respostas = [];
        for (let i = 0; i < 10; i++) {
            const selecionado = document.querySelector(`input[name="q${i}"]:checked`);
            if (!selecionado) {
                alert(`Por favor responda à pergunta número ${i + 1}.`);
                return;
            }
            respostas.push(Number(selecionado.value));
        }
        try {
            const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/carat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ respostas })
            });
            if (!resposta.ok)
                throw new Error('Erro ao submeter o questionário.');
            const resultado = await resposta.json();
            mostrarResultadoCarat(resultado);
            localStorage.setItem('ultimasRecomendacoes', JSON.stringify({
                data: new Date().toISOString(),
                recomendacoes: resultado.recomendacoes || []
            }));
            formCarat.reset();
        }
        catch (erro) {
            alert('Erro ao submeter o questionário. Verifique a ligação ao servidor.');
        }
    });
}
function mostrarResultadoCarat(resultado) {
    const divResultado = document.getElementById('resultado-carat');
    if (!divResultado)
        return;
    divResultado.style.display = 'block';
    document.getElementById('resultado-geral').textContent = 'Estado geral: ' + resultado.interpretacao.geral;
    document.getElementById('resultado-rinite').textContent = 'Rinite: ' + resultado.interpretacao.rinite;
    document.getElementById('resultado-asma').textContent = 'Asma: ' + resultado.interpretacao.asma;
    const lista = document.getElementById('lista-recomendacoes');
    if (lista) {
        lista.innerHTML = '';
        resultado.recomendacoes.forEach((rec) => {
            const item = document.createElement('li');
            item.textContent = rec;
            lista.appendChild(item);
        });
    }
    divResultado.scrollIntoView({ behavior: 'smooth' });
}


async function verificarPedidoCarat() {
    if (!utenteId) return;
    try {
        const r = await fetch(`http://localhost:3000/patients/${utenteId}/pedido-carat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!r.ok) return;
        const dados = await r.json();
        if (dados.temPedido) {
            const banner = document.getElementById('banner-pedido-carat');
            if (banner) {
                banner.style.display = 'flex';
                document.getElementById('btn-ir-carat-banner').addEventListener('click', () => {
                    window.location.href = `carat.html?id=${utenteId}`;
                });
            }
        }
    } catch {}
}

verificarPedidoCarat();
carregarInicio();
