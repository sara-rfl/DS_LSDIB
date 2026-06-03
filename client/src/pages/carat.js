
"use strict";

const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const params = new URLSearchParams(window.location.search);
const utenteId = params.get('id');

document.getElementById('form-carat').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const respostas = [];
    for (let i = 0; i < 10; i++) {
        const selecionado = document.querySelector(`input[name="q${i}"]:checked`);
        if (!selecionado) {
            alert('Por favor responde a todas as perguntas.');
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

        

        if (!resposta.ok) throw new Error('Erro ao submeter');
        const resultado = await resposta.json();
        mostrarResultado(resultado);
    } catch (erro) {
        alert('Erro ao submeter o questionário.');
    }
});

function mostrarResultado(resultado) {
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('resultado-geral').textContent = 'Estado geral: ' + resultado.interpretacao.geral;
    document.getElementById('resultado-rinite').textContent = 'Rinite: ' + resultado.interpretacao.rinite;
    document.getElementById('resultado-asma').textContent = 'Asma: ' + resultado.interpretacao.asma;

    const lista = document.getElementById('lista-recomendacoes');
    lista.innerHTML = '';
    resultado.recomendacoes.forEach(rec => {
        const item = document.createElement('li');
        item.textContent = rec;
        lista.appendChild(item);
    });

    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}
