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

function mostrarSucesso(mensagem) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 16px 24px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10000; font-weight: 500;';
    toast.textContent = '✓ ' + mensagem;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function mostrarErro(mensagem) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 16px 24px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10000; font-weight: 500;';
    toast.textContent = '✗ Erro: ' + mensagem;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
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
        mostrarSucesso('Perfil alterado com sucesso!');
        await Promise.all([carregarUsers(), carregarMedicos(), carregarUtentesAdmin()]);
    } catch {
        mostrarErro('Erro ao alterar o perfil.');
    }
});

// ── MÉDICOS ───────────────────────────────────────────────
let todosMedicos = [];

async function carregarMedicos() {
    try {
        todosMedicos = await api('/doctors');
        const badge = document.getElementById('contagem-medicos');
        if (badge) badge.textContent = `${todosMedicos.length} médicos`;
        desenharMedicos(todosMedicos);
    } catch {
        document.getElementById('tabela-medicos').innerHTML = '<p class="error-message">Erro ao carregar médicos.</p>';
    }
}

function desenharMedicos(lista) {
    const container = document.getElementById('tabela-medicos');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum médico encontrado.</p>';
        return;
    }

    let html = `
        <table class="tabela-utentes">
            <thead><tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Especialidade</th>
                <th>Nr. Ordem</th>
                <th>Telefone</th>
                <th></th>
            </tr></thead>
            <tbody>
    `;

    lista.forEach(m => {
        html += `
            <tr>
                <td><div class="td-nome"><span class="avatar" style="background:linear-gradient(135deg,#1a73e8,#1565c0);">${m.nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}</span>${m.nome}</div></td>
                <td>${m.email}</td>
                <td>${m.especialidade || '—'}</td>
                <td>${m.nrOrdem || '—'}</td>
                <td>${m.telefone || '—'}</td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-alterar-perfil btn-editar-medico" data-id="${m.medicoId}">Editar</button>
                        <button class="btn-eliminar btn-del-medico" data-id="${m.medicoId}" data-nome="${m.nome}">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.btn-editar-medico').forEach(btn => {
        btn.addEventListener('click', () => {
            const m = todosMedicos.find(x => x.medicoId === Number(btn.dataset.id));
            if (m) abrirModalMedico(m);
        });
    });

    container.querySelectorAll('.btn-del-medico').forEach(btn => {
        btn.addEventListener('click', () => {
            abrirModalEliminar('medico', btn.dataset.id, btn.dataset.nome);
        });
    });
}

// ── MODAL MÉDICO ──────────────────────────────────────────
let medicoEmEdicao = null;

function abrirModalMedico(medico = null) {
    medicoEmEdicao = medico;
    const titulo = document.getElementById('modal-medico-titulo');

    if (medico) {
        titulo.textContent = 'Editar Médico';
        document.getElementById('medico-nome').value         = medico.nome;
        document.getElementById('medico-email').value        = medico.email;
        document.getElementById('medico-password').value     = '';
        document.getElementById('medico-especialidade').value = medico.especialidade || '';
        document.getElementById('medico-nrOrdem').value      = medico.nrOrdem || '';
        document.getElementById('medico-telefone').value     = medico.telefone || '';
        document.getElementById('campo-medico-nome').style.display  = 'none';
        document.getElementById('campo-medico-email').style.display = 'none';
        document.getElementById('campo-medico-pass').style.display  = 'none';
    } else {
        titulo.textContent = 'Novo Médico';
        document.getElementById('medico-nome').value         = '';
        document.getElementById('medico-email').value        = '';
        document.getElementById('medico-password').value     = '';
        document.getElementById('medico-especialidade').value = '';
        document.getElementById('medico-nrOrdem').value      = '';
        document.getElementById('medico-telefone').value     = '';
        document.getElementById('campo-medico-nome').style.display  = '';
        document.getElementById('campo-medico-email').style.display = '';
        document.getElementById('campo-medico-pass').style.display  = '';
    }

    document.getElementById('modal-medico').style.display = 'flex';
}

document.getElementById('modal-medico-fechar')?.addEventListener('click', () => {
    document.getElementById('modal-medico').style.display = 'none';
});

document.getElementById('modal-medico')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-medico'))
        document.getElementById('modal-medico').style.display = 'none';
});

document.getElementById('btn-criar-medico')?.addEventListener('click', () => abrirModalMedico(null));

document.getElementById('modal-medico-guardar')?.addEventListener('click', async () => {
    const btn = document.getElementById('modal-medico-guardar');
    btn.disabled = true;

    try {
        if (medicoEmEdicao) {
            await api(`/doctors/${medicoEmEdicao.medicoId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    especialidade: document.getElementById('medico-especialidade').value,
                    nrOrdem:      document.getElementById('medico-nrOrdem').value,
                    telefone:     document.getElementById('medico-telefone').value,
                })
            });
            mostrarSucesso('Médico atualizado com sucesso!');
        } else {
            await api('/doctors', {
                method: 'POST',
                body: JSON.stringify({
                    nome:          document.getElementById('medico-nome').value,
                    email:         document.getElementById('medico-email').value,
                    password:      document.getElementById('medico-password').value,
                    especialidade: document.getElementById('medico-especialidade').value,
                    nrOrdem:       document.getElementById('medico-nrOrdem').value,
                    telefone:      document.getElementById('medico-telefone').value,
                })
            });
            mostrarSucesso('Médico criado com sucesso!');
        }
        document.getElementById('modal-medico').style.display = 'none';
        await carregarMedicos();
        await carregarUsers();
    } catch (err) {
        mostrarErro('Guardar médico: ' + err.message);
    } finally {
        btn.disabled = false;
    }
});

// ── UTENTES ADMIN ─────────────────────────────────────────
let todosUtentesAdmin = [];

async function carregarUtentesAdmin() {
    try {
        todosUtentesAdmin = await api('/patients');
        const badge = document.getElementById('contagem-utentes-admin');
        if (badge) badge.textContent = `${todosUtentesAdmin.length} utentes`;
        desenharUtentesAdmin(todosUtentesAdmin);
    } catch {
        document.getElementById('tabela-utentes-admin').innerHTML = '<p class="error-message">Erro ao carregar utentes.</p>';
    }
}

function desenharUtentesAdmin(lista) {
    const container = document.getElementById('tabela-utentes-admin');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum utente encontrado.</p>';
        return;
    }

    let html = `
        <table class="tabela-utentes">
            <thead><tr>
                <th>Nome</th>
                <th>Email</th>
                <th>N.º Utente</th>
                <th>Data Nasc.</th>
                <th>Telefone</th>
                <th></th>
            </tr></thead>
            <tbody>
    `;

    lista.forEach(u => {
        const dataNasc = u.dataNascimento ? new Date(u.dataNascimento).toLocaleDateString('pt-PT') : '—';
        html += `
            <tr>
                <td><div class="td-nome"><span class="avatar" style="background:linear-gradient(135deg,#16a34a,#15803d);">${u.nome.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()}</span>${u.nome}</div></td>
                <td>${u.email}</td>
                <td>${u.nUtente || '—'}</td>
                <td style="color:#9ca3af; font-size:13px;">${dataNasc}</td>
                <td>${u.telefone || '—'}</td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-alterar-perfil btn-editar-utente" data-id="${u.utenteId}">Editar</button>
                        <button class="btn-eliminar btn-del-utente" data-id="${u.utenteId}" data-nome="${u.nome}">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('.btn-editar-utente').forEach(btn => {
        btn.addEventListener('click', () => {
            const u = todosUtentesAdmin.find(x => x.utenteId === Number(btn.dataset.id));
            if (u) abrirModalUtente(u);
        });
    });

    container.querySelectorAll('.btn-del-utente').forEach(btn => {
        btn.addEventListener('click', () => {
            abrirModalEliminar('utente', btn.dataset.id, btn.dataset.nome);
        });
    });
}

// ── MODAL UTENTE ──────────────────────────────────────────
let utenteEmEdicao = null;

async function abrirModalUtente(utente = null) {
    utenteEmEdicao = utente;

    // Popular select de médicos
    const selectMedico = document.getElementById('utente-medicoId');
    selectMedico.innerHTML = '<option value="">Sem médico atribuído</option>';
    if (todosMedicos.length === 0) await carregarMedicos();
    todosMedicos.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.medicoId;
        opt.textContent = `${m.nome} (${m.especialidade || 'sem especialidade'})`;
        selectMedico.appendChild(opt);
    });

    if (utente) {
        document.getElementById('modal-utente-titulo').textContent = 'Editar Utente';
        document.getElementById('utente-telefone').value        = utente.telefone || '';
        document.getElementById('utente-morada').value          = utente.morada || '';
        document.getElementById('utente-genero').value          = utente.genero || '';
        document.getElementById('utente-medicoId').value        = utente.medicoId || '';
        // campos read-only na edição
        ['campo-utente-nome','campo-utente-email','campo-utente-pass','campo-utente-nUtente','campo-utente-dataNasc'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
    } else {
        document.getElementById('modal-utente-titulo').textContent = 'Novo Utente';
        document.getElementById('utente-nome').value             = '';
        document.getElementById('utente-email').value            = '';
        document.getElementById('utente-password').value         = '';
        document.getElementById('utente-nUtente').value          = '';
        document.getElementById('utente-dataNascimento').value   = '';
        document.getElementById('utente-telefone').value         = '';
        document.getElementById('utente-morada').value           = '';
        document.getElementById('utente-genero').value           = '';
        document.getElementById('utente-medicoId').value         = '';
        ['campo-utente-nome','campo-utente-email','campo-utente-pass','campo-utente-nUtente','campo-utente-dataNasc'].forEach(id => {
            document.getElementById(id).style.display = '';
        });
    }

    document.getElementById('modal-utente').style.display = 'flex';
}

document.getElementById('modal-utente-fechar')?.addEventListener('click', () => {
    document.getElementById('modal-utente').style.display = 'none';
});

document.getElementById('modal-utente')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-utente'))
        document.getElementById('modal-utente').style.display = 'none';
});

document.getElementById('btn-criar-utente')?.addEventListener('click', () => abrirModalUtente(null));

document.getElementById('modal-utente-guardar')?.addEventListener('click', async () => {
    const btn = document.getElementById('modal-utente-guardar');
    btn.disabled = true;

    try {
        if (utenteEmEdicao) {
            await api(`/patients/${utenteEmEdicao.utenteId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    telefone: document.getElementById('utente-telefone').value,
                    morada:   document.getElementById('utente-morada').value,
                    genero:   document.getElementById('utente-genero').value,
                    medicoId: document.getElementById('utente-medicoId').value || null,
                })
            });
            mostrarSucesso('Utente atualizado com sucesso!');
        } else {
            await api('/patients', {
                method: 'POST',
                body: JSON.stringify({
                    nome:           document.getElementById('utente-nome').value,
                    email:          document.getElementById('utente-email').value,
                    password:       document.getElementById('utente-password').value,
                    nUtente:        document.getElementById('utente-nUtente').value,
                    dataNascimento: document.getElementById('utente-dataNascimento').value,
                    telefone:       document.getElementById('utente-telefone').value,
                    morada:         document.getElementById('utente-morada').value,
                    genero:         document.getElementById('utente-genero').value,
                    medicoId:       document.getElementById('utente-medicoId').value || null,
                })
            });
            mostrarSucesso('Utente criado com sucesso!');
        }
        document.getElementById('modal-utente').style.display = 'none';
        await carregarUtentesAdmin();
        await carregarUsers();
    } catch (err) {
        mostrarErro('Guardar utente: ' + err.message);
    } finally {
        btn.disabled = false;
    }
});

// ── MODAL ELIMINAR ────────────────────────────────────────
let eliminarCallback = null;

function abrirModalEliminar(tipo, id, nome) {
    const label = tipo === 'medico' ? 'médico' : 'utente';
    document.getElementById('modal-eliminar-msg').textContent =
        `Tens a certeza que queres eliminar o ${label} "${nome}"? Esta ação não pode ser revertida.`;

    eliminarCallback = async () => {
        try {
            const rota = tipo === 'medico' ? `/doctors/${id}` : `/patients/${id}`;
            await api(rota, { method: 'DELETE' });
            const tipoLabel = tipo === 'medico' ? 'Médico' : 'Utente';
            mostrarSucesso(tipoLabel + ' eliminado com sucesso!');
            document.getElementById('modal-eliminar').style.display = 'none';
            if (tipo === 'medico') await carregarMedicos();
            else await carregarUtentesAdmin();
            await carregarUsers();
        } catch (err) {
            mostrarErro('Eliminar: ' + err.message);
        }
    };

    document.getElementById('modal-eliminar').style.display = 'flex';
}

document.getElementById('modal-eliminar-fechar')?.addEventListener('click', () => {
    document.getElementById('modal-eliminar').style.display = 'none';
});

document.getElementById('modal-eliminar-cancelar')?.addEventListener('click', () => {
    document.getElementById('modal-eliminar').style.display = 'none';
});

document.getElementById('modal-eliminar')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-eliminar'))
        document.getElementById('modal-eliminar').style.display = 'none';
});

document.getElementById('modal-eliminar-confirmar')?.addEventListener('click', async () => {
    if (eliminarCallback) await eliminarCallback();
});

// ── CONFIGURAÇÕES ─────────────────────────────────────────
const NOMES_CONFIG = {
    limiarControloInsuficiente: 'Limiar de Controlo Insuficiente',
    deltaDeterioracao:          'Delta de Deterioração',
    scoreMaximoPossivel:        'Score Máximo Possível',
    scoreMinimoPossivel:        'Score Mínimo Possível',
};

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
                        <div class="config-chave">${NOMES_CONFIG[c.chave] || c.chave}</div>
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
carregarMedicos();
carregarUtentesAdmin();
carregarConfigs();
