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

function gerarNUtente(): number {
  for (let tentativa = 0; tentativa < 20; tentativa++) {
    const n = Math.floor(100000000 + Math.random() * 900000000);
    const existe = db.prepare('SELECT id FROM utente WHERE nUtente = ?').get(n);
    if (!existe) return n;
  }
  throw new Error('Não foi possível gerar um nUtente único');
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

  const perfilAtual = utilizador.perfil;

  db.transaction(() => {
    db.prepare('UPDATE utilizador SET perfil = ? WHERE id = ?').run(perfil, id);

    // Limpar tabela de perfil anterior
    if (perfilAtual === 'medico') {
      db.prepare('DELETE FROM medico WHERE utilizadorId = ?').run(id);
    } else if (perfilAtual === 'utente') {
      db.prepare('DELETE FROM utente WHERE utilizadorId = ?').run(id);
    }

    // Criar registo na nova tabela de perfil
    if (perfil === 'medico') {
      const jaExiste = db.prepare('SELECT id FROM medico WHERE utilizadorId = ?').get(id);
      if (!jaExiste) {
        db.prepare(`
          INSERT INTO medico (utilizadorId, especialidade, telefone, nrOrdem)
          VALUES (?, 'Por definir', 0, 0)
        `).run(id);
      }
    } else if (perfil === 'utente') {
      const jaExiste = db.prepare('SELECT id FROM utente WHERE utilizadorId = ?').get(id);
      if (!jaExiste) {
        const nUtente = gerarNUtente();
        db.prepare(`
          INSERT INTO utente (utilizadorId, nUtente)
          VALUES (?, ?)
        `).run(id, nUtente);
      }
    }
  })();

  return db.prepare('SELECT id, nome, email, perfil FROM utilizador WHERE id = ?').get(id);
}
