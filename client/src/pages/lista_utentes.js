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
        container.innerHTML = '<p>Nenhum paciente encontrado.</p>';
        return;
    }
    let htmlTabela = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left;">
            <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dcdcdc;">
                <th style="padding: 12px;">Nome</th>
                <th style="padding: 12px;">Email</th>
                <th style="padding: 12px;">Perfil</th>
            </tr>
    `;
    lista.forEach((utente) => {
        const perfilCorreto = utente.role || utente.perfil || 'Sem perfil';
        htmlTabela += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">${utente.nome}</td>
                <td style="padding: 12px;">${utente.email}</td>
                <td style="padding: 12px;">${perfilCorreto}</td>
            </tr>
        `;
    });
    htmlTabela += '</table>';
    container.innerHTML = htmlTabela;
}
// ---------------------------------------------------------
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
