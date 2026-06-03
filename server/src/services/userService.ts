import db from '../config/database';

const PERFIS_VALIDOS = ['utente', 'medico', 'admin'];

export function listarTodos() {
  return db.prepare('SELECT id, nome, email, perfil, criadoEm FROM utilizador ORDER BY criadoEm DESC').all();
}

export function eliminar(id: number) {
  const utilizador = db.prepare('SELECT id FROM utilizador WHERE id = ?').get(id) as any;
  if (!utilizador) {
    const erro: any = new Error('Utilizador não encontrado');
    erro.status = 404;
    throw erro;
  }
  db.prepare('DELETE FROM utilizador WHERE id = ?').run(id);
}

export function alterarPerfil(id: number, perfil: string) {
  if (!PERFIS_VALIDOS.includes(perfil)) {
    const erro: any = new Error(`Perfil inválido. Valores aceites: ${PERFIS_VALIDOS.join(', ')}`);
    erro.status = 400;
    throw erro;
  }

  const utilizador = db.prepare('SELECT * FROM utilizador WHERE id = ?').get(id) as any;
  if (!utilizador) {
    const erro: any = new Error('Utilizador não encontrado');
    erro.status = 404;
    throw erro;
  }

  db.prepare('UPDATE utilizador SET perfil = ? WHERE id = ?').run(perfil, id);
  return db.prepare('SELECT id, nome, email, perfil FROM utilizador WHERE id = ?').get(id);
}
