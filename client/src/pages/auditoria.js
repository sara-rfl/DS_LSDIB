"use strict";

const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) btnLogout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

let todosRegistos = [];

async function carregarAuditoria() {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    try {
        const resposta = await fetch('http://localhost:3000/auditoria', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resposta.status === 403) {
            container.innerHTML = '<p class="error-message">Acesso restrito a administradores.</p>';
            return;
        }
        if (!resposta.ok) throw new Error();

        todosRegistos = await resposta.json();

        const contagem = document.getElementById('contagem-registos');
        if (contagem) contagem.textContent = `${todosRegistos.length} registos`;

        desenharTabela(todosRegistos);
    } catch {
        if (container) container.innerHTML = '<p class="error-message">Erro ao carregar registos. Verifica se o servidor está a correr.</p>';
    }
}

const metodoCor = {
    GET:    'badge-utente',
    POST:   'badge-medico',
    PUT:    'badge-default',
    DELETE: 'badge-admin',
};

function desenharTabela(lista) {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum registo encontrado.</p>';
        return;
    }

    let html = `
        <table class="tabela-utentes">
            <thead>
                <tr>
                    <th>Data / Hora</th>
                    <th>Utilizador</th>
                    <th>Perfil</th>
                    <th>Método</th>
                    <th>Recurso</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody>
    `;

    lista.forEach(r => {
        const data = new Date(r.criadoEm).toLocaleString('pt-PT');
        const classe = metodoCor[r.metodo] || 'badge-default';
        const nome = r.nome || '—';
        const perfil = r.perfil || '—';

        html += `
            <tr>
                <td style="white-space:nowrap; color:#6b7280; font-size:13px;">${data}</td>
                <td>${nome}</td>
                <td><span class="badge badge-default">${perfil}</span></td>
                <td><span class="badge ${classe}">${r.metodo}</span></td>
                <td style="font-family:monospace; font-size:13px;">${r.recurso}</td>
                <td style="color:#9ca3af; font-size:13px;">${r.ip}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

const inputPesquisa = document.getElementById('pesquisa-audit');
if (inputPesquisa) {
    inputPesquisa.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = todosRegistos.filter(r =>
            (r.nome || '').toLowerCase().includes(termo) ||
            (r.recurso || '').toLowerCase().includes(termo) ||
            (r.perfil || '').toLowerCase().includes(termo)
        );
        desenharTabela(filtrados);
    });
}

carregarAuditoria();
