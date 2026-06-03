"use strict";
// Captura os elementos do DOM garantindo os tipos corretos
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mensagemErro = document.getElementById('mensagemErro');
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!emailInput || !passwordInput || !mensagemErro)
        return;
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
        const data = await response.json();
        console.log("INFO DO BACKEND:", data);
        if (response.ok) {
            // Guarda a informação crítica no LocalStorage para uso futuro
            localStorage.setItem('token', data.token);
            localStorage.setItem('perfil', data.perfil);
            localStorage.setItem('nome', data.nome);
            localStorage.setItem('userId', data.id.toString());
            if (data.utenteId) {
                localStorage.setItem('utenteId', data.utenteId.toString());
            }
            switch (data.perfil.toLowerCase()) {
                case 'utente':
                    window.location.href = 'dashboard_utente.html';
                    break;
                case 'medico':
                    window.location.href = 'lista_utentes.html';
                    break;
                case 'administrador':
                case 'admin':
                    window.location.href = 'painel_admin.html';
                    break;
                default:
                    console.error('Erro: Perfil não reconhecido pelo sistema ->', data.perfil);
                    break;
            }
        }
        else {
            mensagemErro.innerText = data.mensagem || 'Credenciais inválidas.';
            mensagemErro.style.display = 'block';
        }
    }
    catch (error) {
        mensagemErro.innerText = 'Erro de ligação ao servidor. Verifique se a API está a correr.';
        mensagemErro.style.display = 'block';
        console.error('Erro durante a tentativa de login:', error);
    }
});
