// 1. SEGURANÇA E PREPARAÇÃO
const token = localStorage.getItem('token');
const utenteId = localStorage.getItem('utenteId');

if (!token || !utenteId) {
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
// 2. LÓGICA DO MENU LATERAL 
// ---------------------------------------------------------
const menuPerfil = document.getElementById('menu-perfil');
const menuSintomas = document.getElementById('menu-sintomas');
const menuMedicacao = document.getElementById('menu-medicacao');

const seccaoPerfil = document.getElementById('seccao-perfil');
const seccaoSintomas = document.getElementById('seccao-sintomas');
const seccaoMedicacao = document.getElementById('seccao-medicacao');

function esconderTudo() {
    if (seccaoPerfil) seccaoPerfil.style.display = 'none';
    if (seccaoSintomas) seccaoSintomas.style.display = 'none';
    if (seccaoMedicacao) seccaoMedicacao.style.display = 'none';
    
    if (menuPerfil) menuPerfil.classList.remove('active');
    if (menuSintomas) menuSintomas.classList.remove('active');
    if (menuMedicacao) menuMedicacao.classList.remove('active');
}

if (menuPerfil && menuSintomas && menuMedicacao) {
    menuPerfil.addEventListener('click', () => {
        esconderTudo();
        seccaoPerfil!.style.display = 'block';
        menuPerfil.classList.add('active');
    });

    menuSintomas.addEventListener('click', () => {
        esconderTudo();
        seccaoSintomas!.style.display = 'block';
        menuSintomas.classList.add('active');
        carregarSintomas(); 
    });

    menuMedicacao.addEventListener('click', () => {
        esconderTudo();
        seccaoMedicacao!.style.display = 'block';
        menuMedicacao.classList.add('active');
        carregarMedicacao(); 
    });
}

// 3. COMUNICAR COM A API 

async function carregarDadosPerfil() {
    const container = document.getElementById('seccao-perfil');
    
    if (!container || !utenteId) return;

    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}`, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!resposta.ok) throw new Error('Erro ao carregar perfil.');

        const dadosUtente = await resposta.json();

        container.innerHTML = `
            <h2>Atualizar Dados Pessoais</h2>
            <form id="form-atualizar-perfil" style="display: flex; flex-direction: column; gap: 15px; max-width: 400px;">
                
                <div>
                    <label style="font-weight: bold; font-size: 14px; color: #555;">Nome:</label>
                    <input type="text" id="perfil-nome" class="search-input" value="${dadosUtente.nome || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                </div>
                
                <div>
                    <label style="font-weight: bold; font-size: 14px; color: #555;">Email:</label>
                    <input type="email" id="perfil-email" class="search-input" value="${dadosUtente.email || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                    <small style="color: #888;">Campos de identidade bloqueados por motivos de segurança.</small>
                </div>

                <div>
                    <label style="font-weight: bold; font-size: 14px; color: #555;">Médico Responsável:</label>
                    <input type="text" id="perfil-medico" class="search-input" value="Dr(a). ${dadosUtente.medicoNome || 'Não atribuído'}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed; color: #3498db; font-weight: bold;">
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

                <button type="submit" id="btn-guardar" style="background-color: #3498db; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px; transition: background-color 0.3s;">
                    Guardar Alterações
                </button>
                <p id="mensagem-perfil" style="display: none; margin-top: 10px; font-weight: bold; text-align: center; padding: 10px; border-radius: 6px;"></p>
            </form>
        `;

        // 2. O SISTEMA NERVOSO: Lógica para enviar os dados de volta para a API
        const formAtualizar = document.getElementById('form-atualizar-perfil') as HTMLFormElement;
        const mensagemErro = document.getElementById('mensagem-perfil') as HTMLParagraphElement;

        if (formAtualizar) {
            formAtualizar.addEventListener('submit', async (evento) => {
                evento.preventDefault(); // Impede a página de fazer refresh ao submeter

                // Vamos apanhar apenas os valores das gavetas que o utente pode alterar
                const telefoneNovo = (document.getElementById('perfil-telefone') as HTMLInputElement).value;
                const generoNovo = (document.getElementById('perfil-genero') as HTMLSelectElement).value;
                const moradaNova = (document.getElementById('perfil-morada') as HTMLInputElement).value;

                try {
                    // Enviamos um pedido PUT (Atualizar) para o endpoint do paciente específico
                    const respostaAtualizacao = await fetch(`http://localhost:3000/patients/${utenteId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        // Só enviamos os campos editáveis
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
                    } else {
                        mensagemErro.innerText = 'Erro ao guardar as alterações. Sem permissão.';
                        mensagemErro.style.backgroundColor = '#f8d7da';
                        mensagemErro.style.color = '#721c24';
                        mensagemErro.style.display = 'block';
                    }
                } catch (erroDeRede) {
                    mensagemErro.innerText = 'Erro de ligação ao servidor.';
                    mensagemErro.style.display = 'block';
                }
            });
        }

    } catch (erro) {
        console.error("Erro:", erro);
        container.innerHTML = '<h2>Atualizar Dados Pessoais</h2><p class="error-message" style="color: #e74c3c;">Erro ao ligar ao servidor. Verifica a ligação.</p>';
    }
}


async function carregarSintomas() {
    const container = document.getElementById('tabela-sintomas-container');
    if (!container || !utenteId) return;

    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/sintomas`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) throw new Error('Falha ao obter sintomas.');
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
        
        sintomas.forEach((s: any) => {
            // Cortamos a data para não mostrar as horas se não quisermos
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

    } catch (erro) {
        container.innerHTML = '<p style="color: #e74c3c;">Os serviços clínicos não estão disponíveis de momento.</p>';
    }
}

async function carregarMedicacao() {
    const container = document.getElementById('tabela-medicacao-container');
    if (!container || !utenteId) return;

    try {
        const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/medicacao`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resposta.ok) throw new Error('Falha ao obter medicação.');
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
        
        medicacoes.forEach((m: any) => {
            // Lógica para calcular os dias entre a data de início e de fim
            let duracaoTexto = "Uso Contínuo"; // Assume contínuo se dataFim for null
            
            if (m.dataInicio && m.dataFim) {
                const dataInicial = new Date(m.dataInicio).getTime();
                const dataFinal = new Date(m.dataFim).getTime();
                const diferencaMilissegundos = dataFinal - dataInicial;
                // Converte milissegundos para dias
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

    } catch (erro) {
        container.innerHTML = '<p style="color: #e74c3c;">Os serviços clínicos não estão disponíveis de momento.</p>';
    }
}

if (token) {
    carregarDadosPerfil();
}