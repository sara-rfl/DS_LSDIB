// filepath: /Users/leoalmeida/Desktop/SAUD INOB/2º ANO/DS/Entrega#4/DS_LSDIB/server/src/config/database.ts
import Database from 'better-sqlite3';
import path from 'path';

const db: any = new Database(path.join(__dirname, '..', '..', 'db', 'database.db'));

export default db;