interface LoginResponse {
    token: string;
    perfil: 'UTENTE' | 'MEDICO' | 'ADMINISTRADOR';
    nome: string;
    id: number;
    mensagem?: string; 
}

// Captura os elementos do DOM garantindo os tipos corretos
const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
const emailInput = document.getElementById('email') as HTMLInputElement | null;
const passwordInput = document.getElementById('password') as HTMLInputElement | null;
const mensagemErro = document.getElementById('mensagemErro') as HTMLParagraphElement | null;

loginForm?.addEventListener('submit', async (event: Event) => {
    event.preventDefault(); 

    // Interrompe a execução se os elementos não existirem no HTML
    if (!emailInput || !passwordInput || !mensagemErro) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Converte a resposta forçando o contrato LoginResponse
        const data = await response.json() as LoginResponse;

        if (response.ok) {
            // Guarda a informação crítica no LocalStorage para uso futuro
            localStorage.setItem('token', data.token);
            localStorage.setItem('perfil', data.perfil);
            localStorage.setItem('nome', data.nome);
            localStorage.setItem('userId', data.id.toString());

            // Redireciona com base no perfil autenticado
            switch (data.perfil) {
                case 'UTENTE':
                    window.location.href = '/dashboard_utente.html';
                    break;
                case 'MEDICO':
                    window.location.href = '/lista_utentes.html';
                    break;
                case 'ADMINISTRADOR':
                    window.location.href = '/painel_admin.html';
                    break;
            }
        } else {
            mensagemErro.innerText = data.mensagem || 'Credenciais inválidas.';
            mensagemErro.style.display = 'block';
        }
    } catch (error) {
        mensagemErro.innerText = 'Erro de ligação ao servidor. Verifique se a API está a correr.';
        mensagemErro.style.display = 'block';
        console.error('Erro durante a tentativa de login:', error);
    }
});