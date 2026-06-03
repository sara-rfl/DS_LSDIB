import db from '../config/database';
import bcrypt from 'bcryptjs';

export function listarMedicos() {
  return db.prepare(`
    SELECT u.id, u.nome, u.email, m.id as medicoId, m.especialidade, m.telefone, m.nrOrdem
    FROM utilizador u
    JOIN medico m ON m.utilizadorId = u.id
  `).all();
}

export function obterMedico(id: number) {
  const medico = db.prepare(`
    SELECT u.id, u.nome, u.email, m.id as medicoId, m.especialidade, m.telefone, m.nrOrdem
    FROM utilizador u
    JOIN medico m ON m.utilizadorId = u.id
    WHERE m.id = ?
  `).get(id) as any;

  if (!medico) {
    const erro: any = new Error('Médico não encontrado');
    erro.status = 404;
    throw erro;
  }
  return medico;
}

export function criarMedico(dados: any) {
  const { nome, email, password, especialidade, telefone, nrOrdem } = dados;
  const passwordHash = bcrypt.hashSync(password, 10);
  const criadoEm = new Date().toISOString();

  const utilizador = db.prepare(`
    INSERT INTO utilizador (email, passwordHash, nome, perfil, criadoEm)
    VALUES (?, ?, ?, 'medico', ?)
  `).run(email, passwordHash, nome, criadoEm);

  const medico = db.prepare(`
    INSERT INTO medico (utilizadorId, especialidade, telefone, nrOrdem)
    VALUES (?, ?, ?, ?)
  `).run(utilizador.lastInsertRowid, especialidade, telefone, nrOrdem);

  return obterMedico(medico.lastInsertRowid as number);
}

export function atualizarMedico(id: number, dados: any) {
  const { especialidade, telefone, nrOrdem } = dados;

  db.prepare(`
    UPDATE medico SET especialidade = ?, telefone = ?, nrOrdem = ?
    WHERE id = ?
  `).run(especialidade, telefone, nrOrdem, id);

  return obterMedico(id);
}

export function eliminarMedico(id: number) {
  obterMedico(id);
  const medico = db.prepare('SELECT utilizadorId FROM medico WHERE id = ?').get(id) as any;
  db.prepare('DELETE FROM medico WHERE id = ?').run(id);
  db.prepare('DELETE FROM utilizador WHERE id = ?').run(medico.utilizadorId);
}

export function getMedicoIdPorUtilizadorId(utenteId: number): number | null {
  const stmt = db.prepare(`
      SELECT id FROM medico WHERE utilizadorId = ?
  `);
  const row = stmt.get(utenteId) as { id: number } | undefined;
  return row?.id ?? null;

}