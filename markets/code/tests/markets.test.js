import { jest } from '@jest/globals';
import { getDB, setDB } from '../controllers/marketController.js';
import supertest from 'supertest';
import { app, server } from '../start.js';
import { Low, Memory } from 'lowdb';

// Default data used in the controller
const defaultData = { meta: { "tile": "List of markets", "date": "November 2024" }, markets: [], nextId: 1 };
let db;

let oldDb = null;

beforeEach(async () => {
  // Use in-memory database for tests
  const adapter = new Memory();
  db = new Low(adapter, defaultData);
  db.data = JSON.parse(JSON.stringify(defaultData)); // Deep clone default data
  await db.write();

  oldDb = getDB();
  setDB(db);
});

afterEach(async () => {
  db.data.markets = [];
  await db.write();
  setDB(oldDb);
});

afterAll(() => {
  server.close(); // Ensure the server shuts down
});

describe('Market Controller', () => {
  async function createTestMarket() {
    const market = {
      name: 'Market 1',
      dayOfWeek: 'maandag',
      startTime: '13:00',
      endTime: '17:00',
      description: 'A great market',
      verified: true,
      location: { city: 'City1', address: 'Street1' },
    };
    return await supertest(app).post('/markets').send(market).set('Accept', 'application/json');
  }

  it('should create a market with valid data', async () => {
    const res = await createTestMarket();

    expect(res.status).toBe(201);
    expect(db.data.markets).toHaveLength(1);
    expect(db.data.markets[0].name).toBe('Market 1');
    expect(res.text).toBe('Market created with name: Market 1');
  });

  it('should return all markets', async () => {
    await createTestMarket();

    const res = await supertest(app).get('/markets');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(db.data.markets);
  });

  it('should update a market successfully', async () => {
    const createRes = await createTestMarket();
    const createdMarketId = createRes.body.id || 1; // Retrieve the created market ID dynamically

    const updatedMarket = {
      name: 'Updated Market',
      dayOfWeek: 'woensdag',
      startTime: '15:00',
      endTime: '20:00',
      description: 'Updated description',
      verified: false,
      location: { city: 'Updated City', address: 'Updated Address' },
    };

    const res = await supertest(app).put(`/market/${createdMarketId}`).send(updatedMarket).set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(db.data.markets[0].name).toBe('Updated Market');
    expect(res.text).toBe(`Market updated with id: ${createdMarketId}`);
  });

  it('should delete a market successfully', async () => {
    const createRes = await createTestMarket();
    const createdMarketId = createRes.body.id || 1; // Retrieve the created market ID dynamically

    const res = await supertest(app).delete(`/market/${createdMarketId}`);
    expect(res.status).toBe(200);
    expect(db.data.markets).toHaveLength(0);
    expect(res.text).toBe(`Market deleted with id: ${createdMarketId}`);
  });

  it('should return 404 if market not found', async () => {
    const res = await supertest(app).get('/market/999');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Market not found');
  });

  it('should handle invalid input', async () => {
    const invalidMarket = {
      name: 'Invalid Market',
      dayOfWeek: 'invalidDay',
      startTime: 'invalidDate',
      endTime: '2024-12-15T14:00:00Z',
      description: 'Missing location',
    };

    const res = await supertest(app).post('/markets').send(invalidMarket).set('Accept', 'application/json');
    expect(res.status).toBe(400);
  });
});
