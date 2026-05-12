import Database from 'better-sqlite3';
import path from 'path';

const db: any = new Database(path.join(__dirname, '..', '..', 'BD', 'database.db'));

export default db;
