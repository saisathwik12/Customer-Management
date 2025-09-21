const { Pool } = require('pg');

let pool;
function initDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool.connect(); // ensures the DB is reachable at startup
}
function getPool() {
  if (!pool) throw new Error('Database not initialized');
  return pool;
}
module.exports = { initDb, getPool };
