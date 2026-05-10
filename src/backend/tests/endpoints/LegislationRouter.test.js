const request = require('supertest');
const express = require('express');

jest.mock('../../repositories/legislationRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
const repo = require('../../repositories/legislationRepository');

const router = require('../../endpoints/LegislationRouter');

const app = express();
app.use(express.json());
app.use('/legislation', router);

const VALID_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const mockLegislation = { id: VALID_UUID, title: 'Bill A', text: 'Some text', created_at: '2026-01-01', sponsors: [] };

beforeEach(() => jest.clearAllMocks());

describe('GET /legislation', () => {
  it('returns all legislation', async () => {
    repo.findAll.mockResolvedValue([mockLegislation]);
    const res = await request(app).get('/legislation');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockLegislation]);
  });
});

describe('GET /legislation/:id', () => {
  it('returns a piece of legislation when found', async () => {
    repo.findById.mockResolvedValue(mockLegislation);
    const res = await request(app).get(`/legislation/${VALID_UUID}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislation);
  });

  it('returns 404 when not found', async () => {
    repo.findById.mockResolvedValue(null);
    const res = await request(app).get(`/legislation/${VALID_UUID}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/legislation/not-a-uuid');
    expect(res.status).toBe(400);
  });
});

describe('POST /legislation', () => {
  it('creates and returns legislation', async () => {
    repo.create.mockResolvedValue(mockLegislation);
    const res = await request(app).post('/legislation').send({ title: 'Bill A', text: 'Some text' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockLegislation);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/legislation').send({ title: 'Bill A' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /legislation/:id', () => {
  it('updates and returns the legislation', async () => {
    repo.update.mockResolvedValue(mockLegislation);
    const res = await request(app).put(`/legislation/${VALID_UUID}`).send({ title: 'Bill A', text: 'Updated text' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislation);
  });

  it('returns 404 when not found', async () => {
    repo.update.mockResolvedValue(null);
    const res = await request(app).put(`/legislation/${VALID_UUID}`).send({ title: 'Bill A', text: 'Some text' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).put(`/legislation/${VALID_UUID}`).send({ title: 'Bill A' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).put('/legislation/not-a-uuid').send({ title: 'Bill A', text: 'Some text' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /legislation/:id', () => {
  it('returns 204 on success', async () => {
    repo.remove.mockResolvedValue();
    const res = await request(app).delete(`/legislation/${VALID_UUID}`);
    expect(res.status).toBe(204);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).delete('/legislation/not-a-uuid');
    expect(res.status).toBe(400);
  });
});
