require("dotenv").config();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_URL in .env (see .env.example)");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const CREATE_ITEMS_SQL = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT ''
  );
`;

let ready = false;

async function ensureSchema() {
  if (ready) return;
  await pool.query(CREATE_ITEMS_SQL);
  ready = true;
}

module.exports = { pool, ensureSchema };
