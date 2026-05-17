import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';

export function login(email: string, password: string) {
  const utilizador = db.prepare(
    'SELECT * FROM utilizador WHERE email = ?'
  ).get(email) as any;

  if (!utilizador) {
    const erro: any = new Error('Credenciais inválidas');
    erro.status = 401;
    throw erro;
  }

  const passwordCorreta = bcrypt.compareSync(password, utilizador.passwordHash);
  if (!passwordCorreta) {
    const erro: any = new Error('Credenciais inválidas');
    erro.status = 401;
    throw erro;
  }

  const token = jwt.sign(
    { id: utilizador.id, perfil: utilizador.perfil },
    process.env.JWT_SECRET as string,
    { expiresIn: '8h' }
  );

  return {
    token,
    perfil: utilizador.perfil,
    nome: utilizador.nome,
    id: utilizador.id
  };
}
