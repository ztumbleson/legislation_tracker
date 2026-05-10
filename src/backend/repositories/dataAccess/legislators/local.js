//
// repositories/legislators/local.js
// 05-09-2026
// JSON file data access implementation for the legislator table
//

const { read, write } = require('../jsonDb');
const { randomUUID } = require('crypto');

async function findAll() {
  const db = read();
  return [...db.legislators].sort((a, b) => a.last_name.localeCompare(b.last_name));
}

async function findById(id) {
  const db = read();
  return db.legislators.find((l) => l.id === id) ?? null;
}

async function create({ first_name, last_name, hometown }) {
  const db = read();
  const legislator = { id: randomUUID(), first_name, last_name, hometown };
  db.legislators.push(legislator);
  write(db);
  return legislator;
}

async function update(id, { first_name, last_name, hometown }) {
  const db = read();
  const idx = db.legislators.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  db.legislators[idx] = { ...db.legislators[idx], first_name, last_name, hometown };
  write(db);
  return db.legislators[idx];
}

async function remove(id) {
  const db = read();
  db.legislators = db.legislators.filter((l) => l.id !== id);
  db.legislation_sponsors = db.legislation_sponsors.filter((s) => s.legislator_id !== id);
  write(db);
}

module.exports = { findAll, findById, create, update, remove };
