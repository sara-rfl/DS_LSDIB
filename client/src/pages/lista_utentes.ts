// 1. SEGURANÇA
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });
}

// ---------------------------------------------------------
// VARIÁVEL GLOBAL
let todosUtentes: any[] = []; 
// ---------------------------------------------------------

async function carregarUtentes() {
    const container = document.getElementById('tabela-container');
    if (!container) return;

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
        if (contagem) contagem.textContent = `${todosUtentes.length} utentes`;

        desenharTabela(todosUtentes);

    } catch (erro) {
        console.error("Erro:", erro);
        container.innerHTML = '<p class="error-message" style="display:block;">Erro ao carregar os dados. Verifica se o servidor está a correr.</p>';
    }
}


function desenharTabela(lista: any[]) {
    const container = document.getElementById('tabela-container');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p class="estado-mensagem">Nenhum paciente encontrado.</p>';
        return;
    }

    const badgeClass: Record<string, string> = {
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

    lista.forEach((utente: any) => {
        const perfil = utente.role || utente.perfil || 'outro';
        const classe = badgeClass[perfil.toLowerCase()] || 'badge-default';
        const iniciais = utente.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase();

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
}
// ---------------------------------------------------------

// ---------------------------------------------------------
// FILTRO
const inputPesquisa = document.getElementById('pesquisa-utente') as HTMLInputElement;

if (inputPesquisa) {
    inputPesquisa.addEventListener('input', (evento) => {
        const termo = (evento.target as HTMLInputElement).value.toLowerCase();
        
        const utentesFiltrados = todosUtentes.filter(utente => 
            utente.nome.toLowerCase().includes(termo) || 
            utente.email.toLowerCase().includes(termo)
        );
        
        desenharTabela(utentesFiltrados);
    });
}
// ---------------------------------------------------------

if (token) {
    carregarUtentes();
}