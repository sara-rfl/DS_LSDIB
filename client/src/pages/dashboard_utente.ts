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
// 2. LÓGICA DE NAVEGAÇÃO DOS CARTÕES E SECÇÕES
// ---------------------------------------------------------
const seccaoInicio = document.getElementById('seccao-inicio');
const seccaoPerfil = document.getElementById('seccao-perfil');
const seccaoSintomas = document.getElementById('seccao-sintomas');
const seccaoMedicacao = document.getElementById('seccao-medicacao');
const seccaoCarat = document.getElementById('seccao-carat');
const seccaoHistCarat = document.getElementById('seccao-hist-carat');

const cardPerfil = document.getElementById('card-perfil');
const cardSintomas = document.getElementById('card-sintomas');
const cardMedicacao = document.getElementById('card-medicacao');
const cardCarat = document.getElementById('card-carat');
const cardHistCarat = document.getElementById('card-hist-carat');

const botoesVoltar = document.querySelectorAll('.btn-voltar');

function mostrarSeccao(seccaoAberta: HTMLElement | null) {
    if (seccaoInicio) seccaoInicio.style.display = 'none';
    if (seccaoPerfil) seccaoPerfil.style.display = 'none';
    if (seccaoSintomas) seccaoSintomas.style.display = 'none';
    if (seccaoMedicacao) seccaoMedicacao.style.display = 'none';
    if (seccaoCarat) seccaoCarat.style.display = 'none';
    if (seccaoHistCarat) seccaoHistCarat.style.display = 'none';

    if (seccaoAberta) seccaoAberta.style.display = 'block';
}

if (cardPerfil) cardPerfil.addEventListener('click', () => {
    mostrarSeccao(seccaoPerfil);
    carregarDadosPerfil();
});

if (cardSintomas) cardSintomas.addEventListener('click', () => {
    mostrarSeccao(seccaoSintomas);
    carregarSintomas();
});

if (cardMedicacao) cardMedicacao.addEventListener('click', () => {
    mostrarSeccao(seccaoMedicacao);
    carregarMedicacao();
});

if (cardCarat) cardCarat.addEventListener('click', () => mostrarSeccao(seccaoCarat));
if (cardHistCarat) cardHistCarat.addEventListener('click', () => mostrarSeccao(seccaoHistCarat));

botoesVoltar.forEach(btn => {
    btn.addEventListener('click', () => mostrarSeccao(seccaoInicio));
});

// ---------------------------------------------------------
// 3. COMUNICAR COM A API (PERFIL, SINTOMAS E MEDICAÇÃO)
// ---------------------------------------------------------
async function carregarDadosPerfil() {
    const container = document.getElementById('conteudo-perfil');
    
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
            <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                <h2 style="text-align: center; margin-bottom: 24px; color: #1a1a2e;">Atualizar Dados Pessoais</h2>
                
                <form id="form-atualizar-perfil" style="display: flex; flex-direction: column; gap: 16px;">
                    
                    <div style="display: flex; gap: 15px;">
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Nome:</label>
                            <input type="text" id="perfil-nome" class="search-input" value="${dadosUtente.nome || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                        <div style="flex: 1;">
                            <label style="font-weight: bold; font-size: 14px; color: #555;">Email:</label>
                            <input type="email" id="perfil-email" class="search-input" value="${dadosUtente.email || ''}" disabled style="width: 100%; background-color: #f8f9fa; cursor: not-allowed;">
                        </div>
                    </div>
                    <small style="color: #888; text-align: center; margin-top: -10px; margin-bottom: 5px;">Campos de identidade bloqueados por motivos de segurança.</small>

                    <div>
                        <label style="font-weight: bold; font-size: 14px; color: #555;">Médico Responsável:</label>
                        <input type="text" id="perfil-medico" class="search-input" value="Dr(a). ${dadosUtente.medicoNome || 'Não atribuído'}" disabled style="width: 100%; background-color: #eff6ff; cursor: not-allowed; color: #1a73e8; font-weight: bold;">
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

                    <button type="submit" id="btn-guardar" style="background-color: #1a73e8; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px; transition: all 0.2s; font-size: 15px; box-shadow: 0 4px 12px rgba(26,115,232,0.3);">
                        Guardar Alterações
                    </button>
                    <p id="mensagem-perfil" style="display: none; margin-top: 10px; font-weight: bold; text-align: center; padding: 10px; border-radius: 6px;"></p>
                </form>
            </div>
        `;

        const formAtualizar = document.getElementById('form-atualizar-perfil') as HTMLFormElement;
        const mensagemErro = document.getElementById('mensagem-perfil') as HTMLParagraphElement;

        if (formAtualizar) {
            formAtualizar.addEventListener('submit', async (evento) => {
                evento.preventDefault(); 
                
                const telefoneNovo = (document.getElementById('perfil-telefone') as HTMLInputElement).value;
                const generoNovo = (document.getElementById('perfil-genero') as HTMLSelectElement).value;
                const moradaNova = (document.getElementById('perfil-morada') as HTMLInputElement).value;

                try {
                    const respostaAtualizacao = await fetch(`http://localhost:3000/patients/${utenteId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
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
            let duracaoTexto = "Uso Contínuo"; 
            
            if (m.dataInicio && m.dataFim) {
                const dataInicial = new Date(m.dataInicio).getTime();
                const dataFinal = new Date(m.dataFim).getTime();
                const diferencaMilissegundos = dataFinal - dataInicial;
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

// ---------------------------------------------------------
// 4. LÓGICA DO QUESTIONÁRIO CARAT
// ---------------------------------------------------------
const formCarat = document.getElementById('form-carat') as HTMLFormElement;

if (formCarat) {
    formCarat.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const respostas: number[] = [];
        
        for (let i = 0; i < 10; i++) {
            const selecionado = document.querySelector(`input[name="q${i}"]:checked`) as HTMLInputElement;
            if (!selecionado) {
                alert(`Por favor responda à pergunta número ${i + 1}.`);
                return; 
            }
            respostas.push(Number(selecionado.value));
        }

        try {
            const resposta = await fetch(`http://localhost:3000/patients/${utenteId}/carat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ respostas })
            });

            if (!resposta.ok) throw new Error('Erro ao submeter o questionário.');
            
            const resultado = await resposta.json();
            mostrarResultadoCarat(resultado);
            
            formCarat.reset();

        } catch (erro) {
            alert('Erro ao submeter o questionário. Verifique a ligação ao servidor.');
        }
    });
}

function mostrarResultadoCarat(resultado: any) {
    const divResultado = document.getElementById('resultado-carat');
    if (!divResultado) return;

    divResultado.style.display = 'block';
    document.getElementById('resultado-geral')!.textContent = 'Estado geral: ' + resultado.interpretacao.geral;
    document.getElementById('resultado-rinite')!.textContent = 'Rinite: ' + resultado.interpretacao.rinite;
    document.getElementById('resultado-asma')!.textContent = 'Asma: ' + resultado.interpretacao.asma;

    const lista = document.getElementById('lista-recomendacoes');
    if (lista) {
        lista.innerHTML = '';
        resultado.recomendacoes.forEach((rec: string) => {
            const item = document.createElement('li');
            item.textContent = rec;
            lista.appendChild(item);
        });
    }

    divResultado.scrollIntoView({ behavior: 'smooth' });
}