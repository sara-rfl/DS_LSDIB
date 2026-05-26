import db from '../config/database';

export function obterConfigs() {
  return db.prepare('SELECT * FROM configuracaoLimiar').all();
}

export function atualizarConfig(chave: string, valor: number, atualizadoPor: number) {
  const config = db.prepare('SELECT * FROM configuracaoLimiar WHERE chave = ?').get(chave) as any;

  if (!config) {
    const erro: any = new Error('Configuração não encontrada');
    erro.status = 404;
    throw erro;
  }

  db.prepare('UPDATE configuracaoLimiar SET valor = ?, atualizadoPor = ? WHERE chave = ?').run(valor, atualizadoPor, chave);
  return db.prepare('SELECT * FROM configuracaoLimiar WHERE chave = ?').get(chave);
}
