"use strict";

const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) btnLogout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// ── TABS ──────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
});

// ── FETCH HELPER ──────────────────────────────────────────
async function api(path, options = {}) {
    const res = await fetch('http://localhost:3000' + path, {
        ...options,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? null : res.json();
}

// ── STATS ─────────────────────────────────────────────────
async function carregarStats(users) {
    const total   = users.length;
    const utentes = users.filter(u => u.perfil === 'utente').length;
    const medicos = users.filter(u => u.perfil === 'medico').length;
    const admins  = users.filter(u => u.perfil === 'admin').length;

    document.getElementById('stat-total').textContent   = total;
    document.getElementById('stat-utentes').textContent = utentes;
    document.getElementById('stat-medicos').textContent = medicos;
    document.getElementById('stat-admins').textContent  = admins;
}

// ── UTILIZADORES ──────────────────────────────────────────
let todosUsers = [];
const badgeClass = { medico: 'badge-medico', admin: 'badge-admin', utente: 'badge-utente' };

async function carregarUsers() {
    try {
        todosUsers = await api('/users');
        const contagem = document.getElementById('contagem-users');
        if (contagem) contagem.textContent = `${todosUsers.length} utilizadores`;
        carregarStats(todosUsers);
        desenharUsers(todosUsers);
    } catch {
        document.getElementById('tabela-users').innerHTML = '<p class="error-message">Erro ao carregar utilizadores.</p>';
    }
}

function desenharUsers(lista) {
    const container = document.getElementById('tabela-users');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum utilizador encontrado.</p>';
        return;
    }

    let html = `
        <table class="tabela-utentes">
            <thead><tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Criado em</th>
                <th></th>
            </tr></thead>
            <tbody>
    `;

    lista.forEach(u => {
        const iniciais = u.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
        const classe   = badgeClass[u.perfil] || 'badge-default';
        const data     = u.criadoEm ? new Date(u.criadoEm).toLocaleDateString('pt-PT') : '—';

        html += `
            <tr>
                <td><div class="td-nome"><span class="avatar">${iniciais}</span>${u.nome}</div></td>
                <td>${u.email}</td>
                <td><span class="badge ${classe}">${u.perfil}</span></td>
                <td style="color:#9ca3af; font-size:13px;">${data}</td>
                <td><button class="btn-alterar-perfil" data-id="${u.id}">Alterar perfil</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.btn-alterar-perfil').forEach(btn => {
        btn.addEventListener('click', () => {
            const u = todosUsers.find(x => x.id === Number(btn.dataset.id));
            if (u) abrirModalPerfil(u);
        });
    });
}

document.getElementById('pesquisa-users')?.addEventListener('input', e => {
    const termo = e.target.value.toLowerCase();
    desenharUsers(todosUsers.filter(u =>
        u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    ));
});

// ── MODAL ALTERAR PERFIL ──────────────────────────────────
let utilizadorSelecionado = null;

function abrirModalPerfil(u) {
    utilizadorSelecionado = u;
    const iniciais = u.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('modal-perfil-avatar').textContent = iniciais;
    document.getElementById('modal-perfil-nome').textContent   = u.nome;
    document.getElementById('modal-perfil-email').textContent  = u.email;
    document.getElementById('modal-perfil-atual').textContent  = u.perfil;
    document.getElementById('modal-perfil-select').value       = u.perfil;
    document.getElementById('modal-perfil').style.display      = 'flex';
}

document.getElementById('modal-perfil-fechar')?.addEventListener('click', () => {
    document.getElementById('modal-perfil').style.display = 'none';
});

document.getElementById('modal-perfil')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-perfil'))
        document.getElementById('modal-perfil').style.display = 'none';
});

document.getElementById('modal-perfil-guardar')?.addEventListener('click', async () => {
    if (!utilizadorSelecionado) return;
    const novoPerfil = document.getElementById('modal-perfil-select').value;

    try {
        await api(`/users/${utilizadorSelecionado.id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ perfil: novoPerfil })
        });
        document.getElementById('modal-perfil').style.display = 'none';
        await carregarUsers();
    } catch {
        alert('Erro ao alterar o perfil.');
    }
});

// ── CONFIGURAÇÕES ─────────────────────────────────────────
async function carregarConfigs() {
    const container = document.getElementById('tabela-configs');
    try {
        const configs = await api('/config');
        if (!configs.length) {
            container.innerHTML = '<p class="estado-mensagem">Sem configurações disponíveis.</p>';
            return;
        }

        let html = '<div>';
        configs.forEach(c => {
            html += `
                <div class="config-row">
                    <div class="config-info">
                        <div class="config-chave">${c.chave}</div>
                        <div class="config-descricao">${c.descricao || ''}</div>
                    </div>
                    <input type="number" class="config-input" data-chave="${c.chave}" value="${c.valor}">
                    <button class="btn-config-guardar" data-chave="${c.chave}">Guardar</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.btn-config-guardar').forEach(btn => {
            btn.addEventListener('click', async () => {
                const chave = btn.dataset.chave;
                const valor = container.querySelector(`.config-input[data-chave="${chave}"]`).value;
                try {
                    await api('/config', { method: 'PUT', body: JSON.stringify({ chave, valor: Number(valor) }) });
                    btn.textContent = '✓ Guardado';
                    setTimeout(() => btn.textContent = 'Guardar', 2000);
                } catch {
                    alert('Erro ao guardar configuração.');
                }
            });
        });
    } catch {
        container.innerHTML = '<p class="error-message">Erro ao carregar configurações.</p>';
    }
}

// ── INIT ──────────────────────────────────────────────────
carregarUsers();
carregarConfigs();
