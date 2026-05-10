const request = require('supertest');
const express = require('express');

jest.mock('../../repositories/legislatorRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
const repo = require('../../repositories/legislatorRepository');

jest.mock('../../repositories/legislationRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySponsor: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
const legislationRepo = require('../../repositories/legislationRepository');

const router = require('../../endpoints/LegislatorsRouter');

const app = express();
app.use(express.json());
app.use('/legislators', router);

const VALID_UUID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const OTHER_UUID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
const mockLegislator = { id: VALID_UUID, first_name: 'Jane', last_name: 'Doe', hometown: 'Austin' };
const mockLegislation = { id: OTHER_UUID, title: 'Bill A', text: 'Some text', created_at: '2026-01-01' };

beforeEach(() => jest.clearAllMocks());

describe('GET /legislators', () => {
  it('returns all legislators', async () => {
    repo.findAll.mockResolvedValue([mockLegislator]);
    const res = await request(app).get('/legislators');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockLegislator]);
  });
});

describe('GET /legislators/:id', () => {
  it('returns a legislator when found', async () => {
    repo.findById.mockResolvedValue(mockLegislator);
    const res = await request(app).get(`/legislators/${VALID_UUID}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislator);
  });

  it('returns 404 when not found', async () => {
    repo.findById.mockResolvedValue(null);
    const res = await request(app).get(`/legislators/${VALID_UUID}`);
    expect(res.status).toBe(404);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/legislators/not-a-uuid');
    expect(res.status).toBe(400);
  });
});

describe('GET /legislators/:id/legislation', () => {
  it('returns sponsored legislation for a legislator', async () => {
    legislationRepo.findBySponsor.mockResolvedValue([mockLegislation]);
    const res = await request(app).get(`/legislators/${VALID_UUID}/legislation`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockLegislation]);
  });

  it('returns an empty array when no legislation is sponsored', async () => {
    legislationRepo.findBySponsor.mockResolvedValue([]);
    const res = await request(app).get(`/legislators/${VALID_UUID}/legislation`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).get('/legislators/not-a-uuid/legislation');
    expect(res.status).toBe(400);
  });
});

describe('POST /legislators', () => {
  it('creates and returns a legislator', async () => {
    repo.create.mockResolvedValue(mockLegislator);
    const res = await request(app).post('/legislators').send(mockLegislator);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockLegislator);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/legislators').send({ first_name: 'Jane' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /legislators/:id', () => {
  it('updates and returns the legislator', async () => {
    repo.update.mockResolvedValue(mockLegislator);
    const res = await request(app).put(`/legislators/${VALID_UUID}`).send(mockLegislator);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislator);
  });

  it('returns 404 when not found', async () => {
    repo.update.mockResolvedValue(null);
    const res = await request(app).put(`/legislators/${VALID_UUID}`).send(mockLegislator);
    expect(res.status).toBe(404);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).put(`/legislators/${VALID_UUID}`).send({ first_name: 'Jane' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).put('/legislators/not-a-uuid').send(mockLegislator);
    expect(res.status).toBe(400);
  });
});

describe('DELETE /legislators/:id', () => {
  it('returns 204 on success', async () => {
    repo.remove.mockResolvedValue();
    const res = await request(app).delete(`/legislators/${VALID_UUID}`);
    expect(res.status).toBe(204);
  });

  it('returns 400 for an invalid id', async () => {
    const res = await request(app).delete('/legislators/not-a-uuid');
    expect(res.status).toBe(400);
  });
});
