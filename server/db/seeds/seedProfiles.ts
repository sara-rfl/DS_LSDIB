import db from '../../src/config/database';
import bcrypt from 'bcrypt';



const insertUtilizador = db.prepare(`
  INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm)
  VALUES (?,?,?,?,?)
`);

const utilizadores = [
  {email: 'pedrocunha@clinic.pt', passwordHash: bcrypt.hashSync('password123',10), nome: 'Pedro Cunha', perfil: 'medico', criadoEm: new Date(2025,  3,  6,  7, 23, 47).toISOString()},
  {email: 'marianapinto@clinic.pt', passwordHash: bcrypt.hashSync('password234',10), nome: 'Mariana Pinto', perfil: 'medico', criadoEm: new Date(2025,  2, 15, 14, 32, 47).toISOString()},
  {email: 'mariasilva@clinic.pt', passwordHash: bcrypt.hashSync('password345',10), nome: 'Maria Silva', perfil: 'utente', criadoEm: new Date(2024, 10,  7, 12, 35, 23).toISOString()},
  {email: 'jorgegoncalvez@clinic.pt', passwordHash: bcrypt.hashSync('password456',10), nome: 'Jorge Gonçalvez', perfil: 'utente', criadoEm: new Date(2025,  5, 23,  9, 42,  0).toISOString()},
  {email: 'paulajacinto@clinic.pt', passwordHash: bcrypt.hashSync('password567',10), nome: 'Paula Jacinto', perfil: 'utente', criadoEm: new Date(2025, 11, 11, 16, 17, 22).toISOString()},
  {email: 'rosasantos@clinic.pt', passwordHash: bcrypt.hashSync('password678',10), nome: 'Rosa Santos', perfil: 'utente', criadoEm: new Date(2025,  0, 11, 15, 57,  2).toISOString()},
];

utilizadores.forEach(utilizador => {
  insertUtilizador.run(utilizador.email, utilizador.passwordHash, utilizador.nome, utilizador.perfil, utilizador.criadoEm);
});

// IDs utilizador:
// Pedro,   Medico -> utilizadorId = 1
// Mariana, Medico -> utilizadorId = 2
// Maria,   Utente -> utilizadorId = 3
// Jorge,   Utente -> utilizadorId = 4
// Paula,   Utente -> utilizadorId = 5
// Rosa,    Utente -> utilizadorId = 6

const insertMedico = db.prepare(`
  INSERT INTO medico (utilizadorId, especialidade, telefone, nrOrdem)
  VALUES (?,?,?,?)
`);

const medicos = [
  {utilizadorId: 1, especialidade: 'Pneumonologia', telefone: '912458331', nrOrdem: 12345},
  {utilizadorId: 2, especialidade: 'Alergologia',   telefone: '935882104', nrOrdem: 67890},
];

medicos.forEach(medico => {
  insertMedico.run(medico.utilizadorId, medico.especialidade, medico.telefone, medico.nrOrdem);
});

const insertUtentes = db.prepare(`
    INSERT INTO utente (utilizadorId, medicoId, nUtente, dataNascimento, telefone, morada, genero)
    VALUES (?,?,?,?,?,?,?)
`);

const utentes = [
  {utilizadorId: 3, medicoId: 1, nUtente: 1001, dataNascimento: '1985-06-15', telefone: '967330295', morada: 'Rua de Cedofeita, nº 248, 2º Traseiras', genero: 'feminino'},
  {utilizadorId: 4, medicoId: 1, nUtente: 1002, dataNascimento: '1990-09-20', telefone: '924117842', morada: 'Avenida do Brasil, nº 710, 4º Esq.',      genero: 'masculino'},
  {utilizadorId: 5, medicoId: 2, nUtente: 1003, dataNascimento: '1978-12-05', telefone: '919554023', morada: 'Rua de Júlio Dinis, nº 512, 5º Dto.',      genero: 'feminino'},
  {utilizadorId: 6, medicoId: 2, nUtente: 1004, dataNascimento: '2000-03-10', telefone: '961008767', morada: 'Rua da Estação, nº 15, r/c Centro, 4º Esq.', genero: 'feminino'},
];

utentes.forEach(utente => {
  insertUtentes.run(utente.utilizadorId, utente.medicoId, utente.nUtente, utente.dataNascimento, utente.telefone, utente.morada, utente.genero);
});

console.log('Seed de perfis concluída com sucesso!');