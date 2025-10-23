import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'nnn-tracker.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    day INTEGER NOT NULL,
    checked BOOLEAN DEFAULT 0,
    journal_entry TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, day)
  );

  CREATE TABLE IF NOT EXISTS shared_progress (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    streak INTEGER NOT NULL,
    days_succeeded INTEGER NOT NULL,
    share_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_user_progress ON user_progress(user_id, day);
  CREATE INDEX IF NOT EXISTS idx_shared_progress ON shared_progress(created_at);
`);

export default db;
