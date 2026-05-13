import db from '../../src/config/database';

const insertUtilizador = db.prepare(`
  INSERT INTO utilizador (email, passwordHash, perfil, criadoEm, alteradoEm) VALUES
  (?, ?, ?, ?, ?)
`);

insertUtilizador.run('pedrocunha@clinic.pt',     'hashed_password1', 'medico', new Date(2025,  3,  6,  7, 23, 47).toISOString(), new Date(2025,  3,  6,  7, 23, 47).toISOString());
insertUtilizador.run('marianapinto@clinic.pt',   'hashed_password2', 'medico', new Date(2025,  2, 15, 14, 32, 47).toISOString(), new Date(2026,  1, 27, 11, 56,  4).toISOString());
insertUtilizador.run('mariasilva@clinic.pt',     'hashed_password3', 'utente', new Date(2024, 10,  7, 12, 35, 23).toISOString(), new Date(2025,  2, 15, 14, 32, 47).toISOString());
insertUtilizador.run('jorgegoncalvez@clinic.pt', 'hashed_password4', 'utente', new Date(2025,  5, 23,  9, 42,  0).toISOString(), new Date(2025, 10, 15, 14, 32, 47).toISOString());
insertUtilizador.run('paulajacinto@clinic.pt',   'hashed_password5', 'utente', new Date(2025, 11, 11, 16, 17, 22).toISOString(), new Date(2025, 11, 11, 16, 17, 22).toISOString());
insertUtilizador.run('rosasantos@clinic.pt',     'hashed_password6', 'utente', new Date(2025,  0, 11, 15, 57,  2).toISOString(), new Date(2025, 11, 11, 16, 17, 22).toISOString());

// IDs utilizador:
// Pedro,   Medico -> utilizadorId = 1
// Mariana, Medico -> utilizadorId = 2
// Maria,   Utente -> utilizadorId = 3
// Jorge,   Utente -> utilizadorId = 4
// Paula,   Utente -> utilizadorId = 5
// Rosa,    Utente -> utilizadorId = 6

const insertMedico = db.prepare(`
  INSERT INTO medico (utilizadorId, nome, especialidade, contacto) VALUES
  (?, ?, ?, ?)
`);

insertMedico.run(1, 'Pedro Cunha',   'Pneumonologia', '912 458 331');
insertMedico.run(2, 'Mariana Pinto', 'Alergologia',   '935 882 104');

const insertUtente = db.prepare(`
  INSERT INTO utente (utilizadorId, medicoId, nome, dataNascimento, contacto, morada) VALUES
  (?, ?, ?, ?, ?, ?)
`);

insertUtente.run(3, 1, 'Maria Silva',     '1990-05-13', '967 330 295', 'Rua de Cedofeita, nº 248, 2º Traseiras');
insertUtente.run(4, 2, 'Jorge Gonçalvez', '2002-11-24', '924 117 842', 'Avenida do Brasil, nº 710, 4º Esq.');
insertUtente.run(5, 1, 'Paula Jacinto',   '1985-03-12', '919 554 023', 'Rua de Júlio Dinis, nº 512, 5º Dto.');
insertUtente.run(6, 1, 'Rosa Santos',     '1998-11-25', '961 008 767', 'Rua da Estação, nº 15, r/c Centro, 4º Esq.');

console.log('Seeds de perfis inseridas com sucesso.');