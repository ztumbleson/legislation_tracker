//
// repositories/legislation/local.js
// 05-09-2026
// JSON file data access implementation for the legislation table and sponsor relationships
//

const { read, write } = require('../jsonDb');
const { randomUUID } = require('crypto');

function attachSponsors(legislation, db) {
  const sponsors = db.legislation_sponsors
    .filter((s) => s.legislation_id === legislation.id)
    .map((s) => db.legislators.find((l) => l.id === s.legislator_id))
    .filter(Boolean)
    .map(({ id, first_name, last_name }) => ({ id, first_name, last_name }));
  return { ...legislation, sponsors };
}

async function findAll() {
  const db = read();
  return [...db.legislation]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((l) => attachSponsors(l, db));
}

async function findById(id) {
  const db = read();
  const legislation = db.legislation.find((l) => l.id === id);
  if (!legislation) return null;
  return attachSponsors(legislation, db);
}

async function create(title, text, sponsorIds = []) {
  const db = read();
  const legislation = { id: randomUUID(), created_at: new Date().toISOString(), title, text };
  db.legislation.push(legislation);
  for (const sid of sponsorIds) {
    db.legislation_sponsors.push({ id: randomUUID(), legislation_id: legislation.id, legislator_id: sid });
  }
  write(db);
  return { ...legislation, sponsors: sponsorIds };
}

async function update(id, title, text, sponsorIds = []) {
  const db = read();
  const idx = db.legislation.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  db.legislation[idx] = { ...db.legislation[idx], title, text };
  db.legislation_sponsors = db.legislation_sponsors.filter((s) => s.legislation_id !== id);
  for (const sid of sponsorIds) {
    db.legislation_sponsors.push({ id: randomUUID(), legislation_id: id, legislator_id: sid });
  }
  write(db);
  return { ...db.legislation[idx], sponsors: sponsorIds };
}

async function findBySponsor(legislatorId) {
  const db = read();
  const legislationIds = new Set(
    db.legislation_sponsors
      .filter((s) => s.legislator_id === legislatorId)
      .map((s) => s.legislation_id)
  );
  return db.legislation
    .filter((l) => legislationIds.has(l.id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(({ id, title, text, created_at }) => ({ id, title, text, created_at }));
}

async function remove(id) {
  const db = read();
  db.legislation = db.legislation.filter((l) => l.id !== id);
  db.legislation_sponsors = db.legislation_sponsors.filter((s) => s.legislation_id !== id);
  write(db);
}

module.exports = { findAll, findById, findBySponsor, create, update, remove };
