import db from '../config/database';
import bcrypt from 'bcryptjs';

export function listarUtentes() {
  return db.prepare(`
    SELECT u.id, u.nome, u.email, u.perfil, ut.nUtente, ut.dataNascimento, ut.telefone, ut.morada, ut.genero, ut.medicoId
    FROM utilizador u
    JOIN utente ut ON ut.utilizadorId = u.id
  `).all();
}

export function obterUtente(id: number) {
  const utente = db.prepare(`
    SELECT 
      u.id, u.nome, u.email, 
      ut.nUtente, ut.dataNascimento, ut.telefone, ut.morada, ut.genero, ut.medicoId,
      medico_u.nome AS medicoNome 
    FROM utilizador u
    JOIN utente ut ON ut.utilizadorId = u.id
    LEFT JOIN medico m ON ut.medicoId = m.id
    LEFT JOIN utilizador medico_u ON m.utilizadorId = medico_u.id
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

  db.prepare(`
    INSERT INTO utente (utilizadorId, nUtente, dataNascimento, telefone, morada, genero, medicoId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(utilizador.lastInsertRowid, nUtente, dataNascimento, telefone, morada, genero, medicoId);

  return obterUtente(utilizador.lastInsertRowid as number);
}

export function atualizarUtente(id: number, dados: any) {
  const utenteAtual = obterUtente(id);

  const telefone = dados.telefone !== undefined ? dados.telefone : utenteAtual.telefone;
  const morada = dados.morada !== undefined ? dados.morada : utenteAtual.morada;
  const genero = dados.genero !== undefined ? dados.genero : utenteAtual.genero;
  const medicoId = dados.medicoId !== undefined ? dados.medicoId : utenteAtual.medicoId;

  db.prepare(`
    UPDATE utente SET telefone = ?, morada = ?, genero = ?, medicoId = ?
    WHERE id = ?
  `).run(telefone, morada, genero, medicoId, id);

  return obterUtente(id);
}

export function eliminarUtente(id: number) {
  obterUtente(id);
  db.prepare('DELETE FROM utilizador WHERE id = (SELECT utilizadorId FROM utente WHERE id = ?)').run(id);
}
