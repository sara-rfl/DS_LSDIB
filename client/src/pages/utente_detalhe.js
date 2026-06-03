"use strict";

const token = localStorage.getItem('token');
if (!token) { window.location.href = 'login.html'; }

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const params = new URLSearchParams(window.location.search);
const utenteId = params.get('id');

if (!utenteId) { window.location.href = 'lista_utentes.html'; }

// ── TABS ──────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).style.display = 'block';
    });
});

// ── CABEÇALHO DO UTENTE ───────────────────────────────────
async function carregarInfoUtente() {
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const u = await resposta.json();

        const iniciais = u.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
        document.getElementById('utente-avatar').textContent = iniciais;
        document.getElementById('utente-nome').textContent = u.nome;
        document.getElementById('utente-info').textContent =
            `Nº Utente: ${u.nUtente || '—'} · ${u.email || '—'} · ${u.telefone || '—'}`;
    } catch {
        document.getElementById('utente-nome').textContent = 'Utente não encontrado';
    }
}

// ── SINTOMAS ──────────────────────────────────────────────
async function carregarSintomas() {
    const container = document.getElementById('container-sintomas');
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/sintomas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const lista = await resposta.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Sem sintomas registados.</p>';
            return;
        }

        const gravidadeCor = {
            1: { fundo: '#f0fdf4', texto: '#166534', borda: '#86efac' },
            2: { fundo: '#fffbeb', texto: '#92400e', borda: '#fcd34d' },
            3: { fundo: '#fef2f2', texto: '#991b1b', borda: '#fca5a5' },
        };

        let html = `
            <table class="tabela-utentes">
                <thead><tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Gravidade</th>
                    <th>Início</th>
                    <th>Registado em</th>
                </tr></thead>
                <tbody>
        `;
        lista.forEach(s => {
            const cor = gravidadeCor[s.gravidade] || gravidadeCor[1];
            const dataInicio = s.dataInicioSintoma ? new Date(s.dataInicioSintoma).toLocaleDateString('pt-PT') : '—';
            const dataRegisto = s.dataRegisto ? new Date(s.dataRegisto).toLocaleDateString('pt-PT') : '—';
            html += `
                <tr>
                    <td>${s.tipo || '—'}</td>
                    <td style="max-width:280px;font-size:13px;">${s.descricao || '—'}</td>
                    <td><span style="background:${cor.fundo};color:${cor.texto};border:1px solid ${cor.borda};padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Grau ${s.gravidade}</span></td>
                    <td>${dataInicio}</td>
                    <td>${dataRegisto}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar sintomas.</p>';
    }
}

// ── MEDICAÇÃO ─────────────────────────────────────────────
async function carregarMedicacao() {
    const container = document.getElementById('container-medicacao');
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/medicacao`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const lista = await resposta.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Sem medicação registada.</p>';
            return;
        }

        const hoje = new Date();
        let html = `
            <table class="tabela-utentes">
                <thead><tr>
                    <th>Nome</th>
                    <th>Dose</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Estado</th>
                    <th></th>
                </tr></thead>
                <tbody>
        `;
        lista.forEach(m => {
            const dataInicio = m.dataInicio ? m.dataInicio.substring(0, 10) : '';
            const dataFimValor = m.dataFim ? m.dataFim.substring(0, 10) : '';
            const dataInicioFmt = dataInicio ? new Date(dataInicio).toLocaleDateString('pt-PT') : '—';
            const dataFimFmt = dataFimValor ? new Date(dataFimValor).toLocaleDateString('pt-PT') : '—';
            const ativa = !m.dataFim || new Date(m.dataFim) >= hoje;
            const estadoHtml = ativa
                ? `<span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Ativa</span>`
                : `<span style="background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Terminada</span>`;
            html += `
                <tr id="row-med-${m.id}">
                    <td><strong>${m.nome || '—'}</strong></td>
                    <td>${m.dose || '—'}</td>
                    <td>${dataInicioFmt}</td>
                    <td>${dataFimFmt}</td>
                    <td>${estadoHtml}</td>
                    <td style="display:flex;gap:6px;">
                        <button class="btn-ver btn-editar-med" data-id="${m.id}" data-nome="${m.nome}" data-dose="${m.dose}" data-inicio="${dataInicio}" data-fim="${dataFimValor}">Editar</button>
                        <button class="btn-ver btn-eliminar-med" data-id="${m.id}" style="color:#dc2626;border-color:#fca5a5;">Eliminar</button>
                    </td>
                </tr>
                <tr id="form-row-med-${m.id}" style="display:none;">
                    <td colspan="6" style="padding:16px 20px;background:#f8fafc;">
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:10px;align-items:end;">
                            <div><label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Nome</label><input class="edit-nome" value="${m.nome}" style="width:100%;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;"></div>
                            <div><label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Dose</label><input class="edit-dose" value="${m.dose}" style="width:100%;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;"></div>
                            <div><label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Início</label><input class="edit-inicio" type="date" value="${dataInicio}" style="width:100%;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;"></div>
                            <div><label style="font-size:11px;font-weight:600;color:#6b7280;display:block;margin-bottom:4px;">Fim (opcional)</label><input class="edit-fim" type="date" value="${dataFimValor}" style="width:100%;padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;font-family:inherit;"></div>
                            <div style="display:flex;gap:6px;">
                                <button class="btn-nav btn-guardar-med" data-id="${m.id}" style="font-size:13px;padding:8px 14px;">Guardar</button>
                                <button class="btn-ver btn-cancelar-med" data-id="${m.id}" style="font-size:13px;padding:8px 14px;">Cancelar</button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;

        container.querySelectorAll('.btn-editar-med').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.getElementById(`form-row-med-${id}`).style.display = 'table-row';
                btn.style.display = 'none';
            });
        });

        container.querySelectorAll('.btn-cancelar-med').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                document.getElementById(`form-row-med-${id}`).style.display = 'none';
                document.querySelector(`.btn-editar-med[data-id="${id}"]`).style.display = '';
            });
        });

        container.querySelectorAll('.btn-guardar-med').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const formRow = document.getElementById(`form-row-med-${id}`);
                const nome = formRow.querySelector('.edit-nome').value.trim();
                const dose = formRow.querySelector('.edit-dose').value.trim();
                const dataInicio = formRow.querySelector('.edit-inicio').value;
                const dataFim = formRow.querySelector('.edit-fim').value || null;
                if (!nome || !dose || !dataInicio) { alert('Nome, dose e data de início são obrigatórios.'); return; }
                try {
                    const r = await fetch(`http://localhost:3000/medicacao/${id}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nome, dose, dataInicio, dataFim })
                    });
                    if (!r.ok) throw new Error();
                    await carregarMedicacao();
                } catch { alert('Erro ao atualizar medicação.'); }
            });
        });

        container.querySelectorAll('.btn-eliminar-med').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Tens a certeza que queres eliminar esta medicação?')) return;
                const id = btn.dataset.id;
                try {
                    const r = await fetch(`http://localhost:3000/medicacao/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!r.ok) throw new Error();
                    await carregarMedicacao();
                } catch { alert('Erro ao eliminar medicação.'); }
            });
        });
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar medicação.</p>';
    }
}

// ── PEDIDO CARAT (MÉDICO) ─────────────────────────────────
document.getElementById('btn-pedir-carat').addEventListener('click', async () => {
    if (!confirm('Confirmas o pedido de avaliação CARAT para este utente?')) return;
    try {
        const r = await fetch(`http://localhost:3000/patients/${utenteId}/pedido-carat`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!r.ok) throw new Error();
        alert('Pedido enviado. O utente será notificado ao entrar na sua área.');
    } catch { alert('Erro ao criar pedido de avaliação CARAT.'); }
});

// ── HISTÓRICO CARAT ───────────────────────────────────────
function interpretarGeral(scoreRinite, scoreAsma, scoreTotal) {
    if (scoreTotal > 24 || (scoreRinite > 8 && scoreAsma >= 16)) return 'CONTROLADO';
    return 'NÃO CONTROLADO';
}

async function carregarCarat() {
    const container = document.getElementById('container-carat');
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/carat`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const lista = await resposta.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Sem avaliações CARAT registadas.</p>';
            return;
        }

        let html = `
            <table class="tabela-utentes">
                <thead><tr>
                    <th>Data</th>
                    <th>Score Rinite</th>
                    <th>Score Asma</th>
                    <th>Score Total</th>
                    <th>Estado Geral</th>
                </tr></thead>
                <tbody>
        `;
        lista.forEach(av => {
            const data = av.dataAvaliacao ? new Date(av.dataAvaliacao).toLocaleDateString('pt-PT') : '—';
            const geral = interpretarGeral(av.scoreRinite, av.scoreAsma, av.scoreTotal);
            const geralHtml = geral === 'CONTROLADO'
                ? `<span style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Controlado</span>`
                : `<span style="background:#fef2f2;color:#991b1b;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">Não Controlado</span>`;
            html += `
                <tr>
                    <td>${data}</td>
                    <td>${av.scoreRinite} / 12</td>
                    <td>${av.scoreAsma} / 18</td>
                    <td><strong>${av.scoreTotal} / 30</strong></td>
                    <td>${geralHtml}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar histórico CARAT.</p>';
    }
}

document.getElementById('form-medicacao').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('med-nome').value.trim();
    const dose = document.getElementById('med-dose').value.trim();
    const dataInicio = document.getElementById('med-inicio').value;
    const dataFim = document.getElementById('med-fim').value || null;
    if (!nome || !dose || !dataInicio) { alert('Nome, dose e data de início são obrigatórios.'); return; }
    try {
        const r = await fetch(`http://localhost:3000/patients/${utenteId}/medicacao`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, dose, dataInicio, dataFim })
        });
        if (!r.ok) throw new Error();
        document.getElementById('med-nome').value = '';
        document.getElementById('med-dose').value = '';
        document.getElementById('med-inicio').value = '';
        document.getElementById('med-fim').value = '';
        await carregarMedicacao();
    } catch { alert('Erro ao adicionar medicação.'); }
});

// ── NOTAS CLÍNICAS ────────────────────────────────────────
async function carregarNotas() {
    const container = document.getElementById('container-notas');
    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/notas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const lista = await resposta.json();

        if (lista.length === 0) {
            container.innerHTML = '<p class="estado-mensagem">Sem notas clínicas registadas.</p>';
            return;
        }

        container.innerHTML = lista.map(n => {
            const data = n.criadoEm ? new Date(n.criadoEm).toLocaleString('pt-PT') : '—';
            return `
                <div class="card-tabela" style="padding:20px 24px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <strong style="font-size:15px;color:#1a1a2e;">${n.titulo || 'Nota sem título'}</strong>
                        <span style="font-size:12px;color:#9ca3af;">${data} · ${n.medicoNome || '—'}</span>
                    </div>
                    <p style="font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${n.conteudo}</p>
                </div>
            `;
        }).join('');
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar notas.</p>';
    }
}

document.getElementById('form-nota').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('nota-titulo').value.trim();
    const conteudo = document.getElementById('nota-conteudo').value.trim();
    if (!conteudo) { alert('O conteúdo da nota não pode estar vazio.'); return; }

    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/notas`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: titulo || undefined, conteudo })
        });
        if (!resposta.ok) throw new Error();
        document.getElementById('nota-titulo').value = '';
        document.getElementById('nota-conteudo').value = '';
        await carregarNotas();
    } catch {
        alert('Erro ao guardar a nota clínica.');
    }
});

// ── INICIALIZAR ───────────────────────────────────────────
carregarInfoUtente();
carregarSintomas();
carregarMedicacao();
carregarCarat();
carregarNotas();
