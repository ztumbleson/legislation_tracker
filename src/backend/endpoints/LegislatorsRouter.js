//
// LegislatorsRouter.js
// 05-09-2026
// Express router for legislator CRUD endpoints
//

const express = require('express');
const router = express.Router();
const repo = require('../repositories/legislatorsRepository');
const legislationRepo = require('../repositories/legislationRepository');
const { validId } = require('../utils/validation');

// Get all legislators (/legislators)
router.get('/', async (_req, res) => {
  res.json(await repo.findAll());
});

// Get legislation sponsored by a legislator (/legislators/{id}/legislation)
router.get('/:id/legislation', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  res.json(await legislationRepo.findBySponsor(req.params.id));
});

// Get by ID (/legislators/{id})
router.get('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const legislator = await repo.findById(req.params.id);
  if (!legislator) return res.status(404).json({ error: 'Not found' });
  res.json(legislator);
});

// Create a new legislator (/legislators)
router.post('/', async (req, res) => {
  const { first_name, last_name, hometown } = req.body;
  if (!first_name || !last_name || !hometown) {
    return res.status(400).json({ error: 'first_name, last_name, and hometown are required' });
  }
  res.status(201).json(await repo.create({ first_name, last_name, hometown }));
});

// Update a legislator (/legislators/{id})
router.put('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const { first_name, last_name, hometown } = req.body;
  if (!first_name || !last_name || !hometown) {
    return res.status(400).json({ error: 'first_name, last_name, and hometown are required' });
  }
  const legislator = await repo.update(req.params.id, { first_name, last_name, hometown });
  if (!legislator) return res.status(404).json({ error: 'Not found' });
  res.json(legislator);
});

// Delete a legislator (/legislators/{id})
router.delete('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  await repo.remove(req.params.id);
  res.status(204).send();
});

module.exports = router;
