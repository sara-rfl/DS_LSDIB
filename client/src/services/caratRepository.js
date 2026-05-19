const API_BASE = '/api';

export async function submeterAvaliacao(utenteId, respostas) {
    const response = await fetch(`${API_BASE}/carat/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utenteId, respostas })
    });
    if (!response.ok) throw new Error('Erro ao submeter avaliação');
    return response.json();
}
