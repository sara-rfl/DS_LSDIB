"use strict";

const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) btnLogout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const REGISTOS_POR_PAGINA = 20;
let todosRegistos = [];
let registosFiltrados = [];
let paginaAtual = 1;

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
        registosFiltrados = todosRegistos;
        paginaAtual = 1;

        atualizarContagem();
        desenharTabela();
        desenharPaginacao();
    } catch {
        if (container) container.innerHTML = '<p class="error-message">Erro ao carregar registos. Verifica se o servidor está a correr.</p>';
    }
}

function atualizarContagem() {
    const contagem = document.getElementById('contagem-registos');
    if (contagem) contagem.textContent = `${registosFiltrados.length} registos`;
}

const metodoCor = {
    GET:    'badge-utente',
    POST:   'badge-medico',
    PUT:    'badge-default',
    DELETE: 'badge-admin',
};

function desenharTabela() {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    if (registosFiltrados.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum registo encontrado.</p>';
        return;
    }

    const inicio = (paginaAtual - 1) * REGISTOS_POR_PAGINA;
    const pagina = registosFiltrados.slice(inicio, inicio + REGISTOS_POR_PAGINA);

    let html = `
        <table class="tabela-utentes">
            <thead>
                <tr>
                    <th>Data / Hora</th>
                    <th>Utilizador</th>
                    <th>Perfil</th>
                    <th>Método</th>
                    <th>Recurso</th>
                </tr>
            </thead>
            <tbody>
    `;

    pagina.forEach(r => {
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
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function desenharPaginacao() {
    const paginacao = document.getElementById('paginacao');
    if (!paginacao) return;

    const totalPaginas = Math.ceil(registosFiltrados.length / REGISTOS_POR_PAGINA);
    if (totalPaginas <= 1) { paginacao.innerHTML = ''; return; }

    let html = `<button class="btn-pagina" ${paginaAtual === 1 ? 'disabled' : ''} data-pagina="${paginaAtual - 1}">&#8592;</button>`;

    const janela = 2;
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaAtual - janela && i <= paginaAtual + janela)) {
            html += `<button class="btn-pagina ${i === paginaAtual ? 'ativo' : ''}" data-pagina="${i}">${i}</button>`;
        } else if (i === paginaAtual - janela - 1 || i === paginaAtual + janela + 1) {
            html += `<span class="pagina-ellipsis">…</span>`;
        }
    }

    html += `<button class="btn-pagina" ${paginaAtual === totalPaginas ? 'disabled' : ''} data-pagina="${paginaAtual + 1}">&#8594;</button>`;

    paginacao.innerHTML = html;

    paginacao.querySelectorAll('.btn-pagina').forEach(btn => {
        btn.addEventListener('click', () => {
            paginaAtual = Number(btn.dataset.pagina);
            desenharTabela();
            desenharPaginacao();
        });
    });
}

const inputPesquisa = document.getElementById('pesquisa-audit');
if (inputPesquisa) {
    inputPesquisa.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        registosFiltrados = todosRegistos.filter(r =>
            (r.nome || '').toLowerCase().includes(termo) ||
            (r.recurso || '').toLowerCase().includes(termo) ||
            (r.perfil || '').toLowerCase().includes(termo)
        );
        paginaAtual = 1;
        atualizarContagem();
        desenharTabela();
        desenharPaginacao();
    });
}

const btnLimpar = document.getElementById('btn-limpar');
if (btnLimpar) {
    btnLimpar.addEventListener('click', async () => {
        if (!confirm('Tens a certeza que queres apagar todos os registos de auditoria?')) return;
        try {
            const resposta = await fetch('http://localhost:3000/auditoria', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!resposta.ok) throw new Error();
            todosRegistos = [];
            registosFiltrados = [];
            paginaAtual = 1;
            atualizarContagem();
            desenharTabela();
            desenharPaginacao();
        } catch {
            alert('Erro ao apagar registos.');
        }
    });
}

carregarAuditoria();
