"use strict";

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

let todosAlertas = [];

async function carregarAlertas(estado = '') {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    try {
        const url = estado
            ? `http://localhost:3000/api/alertas?estado=${estado}`
            : `http://localhost:3000/api/alertas`;

        const resposta = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        todosAlertas = await resposta.json();

        const contagem = document.getElementById('contagem-alertas');
        if (contagem) contagem.textContent = `${todosAlertas.length} alertas`;

        desenharTabela(todosAlertas);
    } catch {
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar alertas.</p>';
    }
}

function desenharTabela(lista) {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum alerta encontrado.</p>';
        return;
    }

    const prioridadeCor = {
        'ALTA':  { fundo: '#fef2f2', texto: '#991b1b', borda: '#fca5a5' },
        'MEDIA': { fundo: '#fffbeb', texto: '#92400e', borda: '#fcd34d' },
        'BAIXA': { fundo: '#f0fdf4', texto: '#166534', borda: '#86efac' },
    };

    const estadoCor = {
        'Novo':          { fundo: '#eff6ff', texto: '#1d4ed8' },
        'Visto':         { fundo: '#f5f3ff', texto: '#6d28d9' },
        'Em_Seguimento': { fundo: '#fff7ed', texto: '#c2410c' },
        'Fechado':       { fundo: '#f1f5f9', texto: '#475569' },
    };

    let html = `
        <table class="tabela-utentes">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Utente</th>
                    <th>Tipo</th>
                    <th>Motivo</th>
                    <th>Prioridade</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;

    lista.forEach((alerta) => {
        const data = alerta.criadoEm ? new Date(alerta.criadoEm).toLocaleDateString('pt-PT') : '—';
        const pCor = prioridadeCor[alerta.prioridade] || prioridadeCor['BAIXA'];
        const eCor = estadoCor[alerta.estado] || estadoCor['Novo'];

        html += `
            <tr>
                <td>${data}</td>
                <td>${alerta.utenteNome || '—'}</td>
                <td>${alerta.tipo || '—'}</td>
                <td style="max-width:280px; font-size:13px;">${alerta.motivo || '—'}</td>
                <td>
                    <span style="background:${pCor.fundo}; color:${pCor.texto}; border:1px solid ${pCor.borda}; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600;">
                        ${alerta.prioridade}
                    </span>
                </td>
                <td>
                    <select class="select-estado" data-id="${alerta.id}" style="background:${eCor.fundo}; color:${eCor.texto}; border:none; padding:5px 8px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;">
                        <option value="Novo"          ${alerta.estado === 'Novo'          ? 'selected' : ''}>Novo</option>
                        <option value="Visto"         ${alerta.estado === 'Visto'         ? 'selected' : ''}>Visto</option>
                        <option value="Em_Seguimento" ${alerta.estado === 'Em_Seguimento' ? 'selected' : ''}>Em Seguimento</option>
                        <option value="Fechado"       ${alerta.estado === 'Fechado'       ? 'selected' : ''}>Fechado</option>
                    </select>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.select-estado').forEach((select) => {
        select.addEventListener('change', async (e) => {
            const alertaId = e.target.getAttribute('data-id');
            const novoEstado = e.target.value;
            await atualizarEstado(alertaId, novoEstado, e.target);
        });
    });
}

async function atualizarEstado(alertaId, novoEstado, selectEl) {
    const estadoCor = {
        'Novo':          { fundo: '#eff6ff', texto: '#1d4ed8' },
        'Visto':         { fundo: '#f5f3ff', texto: '#6d28d9' },
        'Em_Seguimento': { fundo: '#fff7ed', texto: '#c2410c' },
        'Fechado':       { fundo: '#f1f5f9', texto: '#475569' },
    };

    try {
        const resposta = await fetch(`http://localhost:3000/api/alertas/${alertaId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ novoEstado })
        });
        if (!resposta.ok) throw new Error();

        const cor = estadoCor[novoEstado] || estadoCor['Novo'];
        selectEl.style.background = cor.fundo;
        selectEl.style.color = cor.texto;
    } catch {
        alert('Erro ao atualizar o estado do alerta.');
        const estado = todosAlertas.find(a => a.id == alertaId)?.estado || 'Novo';
        selectEl.value = estado;
    }
}

document.getElementById('filtro-estado').addEventListener('change', (e) => {
    carregarAlertas(e.target.value);
});

carregarAlertas();
