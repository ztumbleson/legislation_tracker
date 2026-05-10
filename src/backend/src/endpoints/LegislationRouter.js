const express = require('express');
const router = express.Router();
const repo = require('../repositories/legislationRepository');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validId = id => UUID_RE.test(id);

// Get all legislation (/legislation)
router.get('/', async (req, res) => {
  res.json(await repo.findAll());
});

// Get an individual piece of legislation by ID (/legislation/{id})
router.get('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const legislation = await repo.findById(req.params.id);
  if (!legislation) return res.status(404).json({ error: 'Not found' });
  res.json(legislation);
});

// Create a new piece of legislation (/legislation)
router.post('/', async (req, res) => {
  const { title, text, sponsor_ids = [] } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'title and text are required' });
  }
  res.status(201).json(await repo.create(title, text, sponsor_ids));
});

// Update an existing piece of legislation (/legislation/{id})
router.put('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  const { title, text, sponsor_ids = [] } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'title and text are required' });
  }
  const legislation = await repo.update(req.params.id, title, text, sponsor_ids);
  if (!legislation) return res.status(404).json({ error: 'Not found' });
  res.json(legislation);
});

// Delete a piece of legislation (/legislation/{id})
router.delete('/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: 'Invalid id' });
  await repo.remove(req.params.id);
  res.status(204).send();
});

module.exports = router;
