//
// jsonDb.js
// 05-09-2026
// Lightweight file-based persistence used when Supabase env vars are not set
//

const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'local.db.json');

const EMPTY = { legislators: [], legislation: [], legislation_sponsors: [] };

function read() {
  if (!fs.existsSync(DB_PATH)) return structuredClone(EMPTY);
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
