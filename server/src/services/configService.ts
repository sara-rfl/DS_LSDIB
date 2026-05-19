import db from '../config/database';

export function obterConfigs() {
  return db.prepare('SELECT * FROM configuracaoLimiar').all();
}

export function atualizarConfig(chave: string, valor: number) {
  const config = db.prepare('SELECT * FROM configuracaoLimiar WHERE chave = ?').get(chave) as any;

  if (!config) {
    const erro: any = new Error('Configuração não encontrada');
    erro.status = 404;
    throw erro;
  }

  db.prepare('UPDATE configuracaoLimiar SET valor = ? WHERE chave = ?').run(valor, chave);
  return db.prepare('SELECT * FROM configuracaoLimiar WHERE chave = ?').get(chave);
}
