import pkg from 'pg';
import 'dotenv/config'; // Load .env file

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon's default SSL setup
  }
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

console.log('PostgreSQL pool initialized.');

export default pool;