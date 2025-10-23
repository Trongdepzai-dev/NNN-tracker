import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.connect();

    console.log('Running migrations...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table users created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER,
        day INTEGER,
        checked BOOLEAN,
        journal_entry TEXT,
        updated_at TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (user_id, day),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log('Table user_progress created or already exists.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared_progress (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER,
        user_name VARCHAR(255),
        streak INTEGER,
        days_succeeded INTEGER,
        share_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
    console.log('Table shared_progress created or already exists.');

    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
