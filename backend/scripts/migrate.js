// Applique tous les fichiers de /migrations (ordre alphabétique).
// Les scripts utilisent "IF NOT EXISTS" : on peut relancer la commande sans risque.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
  const dir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await connection.query(sql);
      console.log(`[MIGRATION] ${file} appliquée`);
    }
  } finally {
    await connection.end();
  }
}

migrate().catch((err) => {
  console.error('[MIGRATION] Échec :', err.message);
  process.exit(1);
});