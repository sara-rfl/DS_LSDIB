import db from '../config/database';
import bcrypt from 'bcryptjs';

export function listarUtentes() {
  return db.prepare(`
    SELECT u.id, u.nome, u.email, ut.nUtente, ut.dataNascimento, ut.telefone, ut.morada, ut.genero, ut.medicoId
    FROM utilizador u
    JOIN utente ut ON ut.utilizadorId = u.id
  `).all();
}

export function obterUtente(id: number) {
  const utente = db.prepare(`
    SELECT u.id, u.nome, u.email, ut.nUtente, ut.dataNascimento, ut.telefone, ut.morada, ut.genero, ut.medicoId
    FROM utilizador u
    JOIN utente ut ON ut.utilizadorId = u.id
    WHERE ut.id = ?
  `).get(id) as any;

  if (!utente) {
    const erro: any = new Error('Utente não encontrado');
    erro.status = 404;
    throw erro;
  }
  return utente;
}

export function criarUtente(dados: any) {
  const { nome, email, password, nUtente, dataNascimento, telefone, morada, genero, medicoId } = dados;
  const passwordHash = bcrypt.hashSync(password, 10);
  const criadoEm = new Date().toISOString();

  const utilizador = db.prepare(`
    INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm)
    VALUES (?, ?, ?, 'utente', ?)
  `).run(email, passwordHash, nome, criadoEm);

  const utente = db.prepare(`
    INSERT INTO utente (utilizadorId, nUtente, dataNascimento, telefone, morada, genero, medicoId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(utilizador.lastInsertRowid, nUtente, dataNascimento, telefone, morada, genero, medicoId);

  // Usa o id do utente, não do utilizador
  return obterUtente(utente.lastInsertRowid as number);
}

export function atualizarUtente(id: number, dados: any) {
  const { telefone, morada, genero, medicoId } = dados;

  db.prepare(`
    UPDATE utente SET telefone = ?, morada = ?, genero = ?, medicoId = ?
    WHERE id = ?
  `).run(telefone, morada, genero, medicoId, id);

  return obterUtente(id);
}

export function eliminarUtente(id: number) {
  obterUtente(id);
  const utente = db.prepare('SELECT utilizadorId FROM utente WHERE id = ?').get(id) as any;
  db.prepare('DELETE FROM utente WHERE id = ?').run(id);
  db.prepare('DELETE FROM utilizador WHERE id = ?').run(utente.utilizadorId);
}
