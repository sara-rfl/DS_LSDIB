"use strict";
// 1. SEGURANÇA
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}
// ---------------------------------------------------------
// VARIÁVEL GLOBAL
let todosUtentes = [];
// ---------------------------------------------------------
async function carregarUtentes() {
    const container = document.getElementById('tabela-container');
    if (!container)
        return;
    try {
        const resposta = await fetch('http://localhost:3000/patients', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!resposta.ok) {
            throw new Error('Sem autorização ou erro no servidor.');
        }
        todosUtentes = await resposta.json();
        const contagem = document.getElementById('contagem-utentes');
        if (contagem)
            contagem.textContent = `${todosUtentes.length} utentes`;
        desenharTabela(todosUtentes);
    }
    catch (erro) {
        console.error("Erro:", erro);
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar os dados. Verifica se o servidor está a correr.</p>';
    }
}
function desenharTabela(lista) {
    const container = document.getElementById('tabela-container');
    if (!container)
        return;
    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum paciente encontrado.</p>';
        return;
    }
    const badgeClass = {
        medico: 'badge-medico',
        admin: 'badge-admin',
        utente: 'badge-utente',
    };
    let htmlTabela = `
        <table class="tabela-utentes">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;
    lista.forEach((utente) => {
        const perfil = utente.role || utente.perfil || 'outro';
        const classe = badgeClass[perfil.toLowerCase()] || 'badge-default';
        const iniciais = utente.nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
        htmlTabela += `
            <tr>
                <td><div class="td-nome"><span class="avatar">${iniciais}</span>${utente.nome}</div></td>
                <td>${utente.email}</td>
                <td><span class="badge ${classe}">${perfil}</span></td>
                <td><button class="btn-ver">Ver detalhes</button></td>
            </tr>
        `;
    });
    htmlTabela += '</tbody></table>';
    container.innerHTML = htmlTabela;

    container.querySelectorAll('.btn-ver').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            window.location.href = `utente_detalhe.html?id=${lista[i].utenteId}`;
        });
    });
}
// ---------------------------------------------------------
// ---------------------------------------------------------
// MODAL
const overlay = document.getElementById('modal-overlay');
const btnFechar = document.getElementById('modal-fechar');

if (btnFechar) btnFechar.addEventListener('click', fecharModal);
if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });

function fecharModal() {
    if (overlay) overlay.style.display = 'none';
}

async function abrirModal(id) {
    if (!overlay) return;
    overlay.style.display = 'flex';

    try {
        const resposta = await fetch(`http://localhost:3000/patients/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resposta.ok) throw new Error();
        const u = await resposta.json();

        const iniciais = u.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
        document.getElementById('modal-avatar').textContent = iniciais;
        document.getElementById('modal-nome').textContent = u.nome;
        document.getElementById('modal-email').textContent = u.email;
        document.getElementById('modal-nutente').textContent = u.nUtente || '—';
        document.getElementById('modal-nascimento').textContent = u.dataNascimento ? new Date(u.dataNascimento).toLocaleDateString('pt-PT') : '—';
        document.getElementById('modal-genero').textContent = u.genero || '—';
        document.getElementById('modal-telefone').textContent = u.telefone || '—';
        document.getElementById('modal-morada').textContent = u.morada || '—';
    } catch {
        fecharModal();
        alert('Erro ao carregar detalhes do utente.');
    }
}
// ---------------------------------------------------------
// FILTRO
const inputPesquisa = document.getElementById('pesquisa-utente');
if (inputPesquisa) {
    inputPesquisa.addEventListener('input', (evento) => {
        const termo = evento.target.value.toLowerCase();
        const utentesFiltrados = todosUtentes.filter(utente => utente.nome.toLowerCase().includes(termo) ||
            utente.email.toLowerCase().includes(termo));
        desenharTabela(utentesFiltrados);
    });
}
// ---------------------------------------------------------
if (token) {
    carregarUtentes();
}
