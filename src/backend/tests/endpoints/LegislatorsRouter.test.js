const request = require('supertest');
const express = require('express');

jest.mock('../../src/repositories/legislatorRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
const repo = require('../../src/repositories/legislatorRepository');

const router = require('../../src/endpoints/LegislatorsRouter');

const app = express();
app.use(express.json());
app.use('/legislators', router);

const mockLegislator = { id: 1, first_name: 'Jane', last_name: 'Doe', hometown: 'Austin' };

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
    const res = await request(app).get('/legislators/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislator);
  });

  it('returns 404 when not found', async () => {
    repo.findById.mockResolvedValue(null);
    const res = await request(app).get('/legislators/999');
    expect(res.status).toBe(404);
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
    const res = await request(app).put('/legislators/1').send(mockLegislator);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockLegislator);
  });

  it('returns 404 when not found', async () => {
    repo.update.mockResolvedValue(null);
    const res = await request(app).put('/legislators/999').send(mockLegislator);
    expect(res.status).toBe(404);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).put('/legislators/1').send({ first_name: 'Jane' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /legislators/:id', () => {
  it('returns 204 on success', async () => {
    repo.remove.mockResolvedValue();
    const res = await request(app).delete('/legislators/1');
    expect(res.status).toBe(204);
  });
});
