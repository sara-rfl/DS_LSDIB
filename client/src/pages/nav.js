"use strict";

const logo = document.querySelector('.logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        const perfil = (localStorage.getItem('perfil') || '').toLowerCase();
        switch (perfil) {
            case 'utente':        window.location.href = 'dashboard_utente.html'; break;
            case 'medico':        window.location.href = 'lista_utentes.html'; break;
            case 'admin':
            case 'administrador': window.location.href = 'painel_admin.html'; break;
            default:              window.location.href = 'login.html';
        }
    });
}
