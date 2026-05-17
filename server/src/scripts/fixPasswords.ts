import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from '../config/database';

const hash = bcrypt.hashSync('password123', 10);

db.prepare(`UPDATE utilizador SET passwordHash = ?`).run(hash);

console.log('Passwords actualizadas com sucesso!');
