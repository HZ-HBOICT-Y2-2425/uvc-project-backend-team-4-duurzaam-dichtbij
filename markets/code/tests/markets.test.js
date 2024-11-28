import { jest } from '@jest/globals';
import { getDB, setDB } from '../controllers/marketController.js';
import supertest from 'supertest';
import { app } from '../start.js';
import { Low, Memory } from 'lowdb';
import e from 'express';

// Default data used in the controller
const defaultData = { meta: { "tile": "List of markets", "date": "November 2024" }, markets: [] };
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

describe('Market Controller', () => {
  jest.setTimeout(20000);

  it('should create a market with valid data', async () => {
    const newMarket = {
      name: 'Market 1',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    };

    const res = await supertest(app)
      .post('/markets')
      .send(newMarket)
      .set('Accept', 'application/json');

      
    // const res = (await supertest(app).post('/markets')).status(201).send(newMarket);
    
    expect(db.data.markets).toHaveLength(1); // Ensure one market is added
    expect(db.data.markets[0].name).toBe('Market 1'); // Check the market name
    expect(res.status).toBe(201); // Ensure response status is 201
    expect(res.text).toBe(`Market created with name: ${newMarket.name}`); // Check send message
  });

  it('should return a list of all markets', async () => {
    const res = await supertest(app).get('/markets');

    expect(res.status).toBe(200); // Ensure response status is 200
    expect(res.body).toEqual(db.data.markets); // Ensure the response body matches the database
  });

  it('should update a market successfully', async () => {
    const market = {
      name: 'Market 1',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    };

    const res1 = await supertest(app)
      .post('/markets')
      .send(market)
      .set('Accept', 'application/json');

    expect(res1.status).toBe(201); // Ensure response status is 201
    expect(db.data.markets).toHaveLength(1); // Ensure one market is added
    expect(db.data.markets[0].name).toBe('Market 1'); // Check the market name
    expect(res1.text).toBe(`Market created with name: ${market.name}`); // Check send message


    const updatedMarket = {
      name: 'Market 2',
      startDate: '2024-12-20',
      endDate: '2024-12-30',
      description: 'An even better market',
      location: { city: 'City2', address: 'Street2' }
    };

    const res2 = await supertest(app)
      .put('/market/1')
      .send(updatedMarket)
      .set('Accept', 'application/json');

    expect(db.data.markets[0].name).toBe('Market 2'); // Ensure the market is updated
    expect(db.data.markets).toHaveLength(1);
    expect(res2.status).toBe(200); // Check response status
    expect(res2.text).toBe(`Market updated with id: 1`); // Check send message
  });

  it('should delete a market successfully', async () => {
    const market = {
      name: 'Market 1',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    };

    const res1 = await supertest(app)
      .post('/markets')
      .send(market)
      .set('Accept', 'application/json');

    expect(res1.status).toBe(201); // Ensure response status is 201
    expect(db.data.markets).toHaveLength(1); // Ensure one market is added
    expect(db.data.markets[0].name).toBe('Market 1'); // Check the market name
    expect(res1.text).toBe(`Market created with name: ${market.name}`); // Check send message

    const res2 = await supertest(app).delete('/market/1');

    expect(db.data.markets).toHaveLength(0); // Ensure the market is deleted
    expect(res2.status).toBe(200); // Check response status
    expect(res2.text).toBe(`Market deleted with id: 1`); // Check send message
  });

  it('should return 404 if market not found', async () => {
    const res = await supertest(app).get('/market/1');

    expect(res.status).toBe(404); // Ensure response status is 404
    expect(res.text).toBe('Market not found'); // Check send message
  });
});
