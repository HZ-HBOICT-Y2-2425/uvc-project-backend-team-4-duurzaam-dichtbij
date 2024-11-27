import { jest } from '@jest/globals';
import { createMarket, responseMarkets, responseMarket, updateMarket, deleteMarket } from '../controllers/marketController.js';
import supertest from 'supertest';
import { app } from '../start.js'
import { JSONFilePreset } from 'lowdb/node';

// Default data used in the controller
const defaultData = { meta: { "tile": "List of markets", "date": "November 2024" }, markets: [] };
let db;

beforeEach(async () => {
  // Initialize the database with the correct structure
  db = await JSONFilePreset('db.json', defaultData);
  db.data.markets = []; // Initialize with empty list of markets
});

afterEach(async () => {
  // Clear all market records added during tests
  db.data.markets = [];
  await db.write(); // Write the changes back to the file
});

describe('Market Controller', () => {
  jest.setTimeout(20000)

  it('should create a market with valid data', async () => {
    const newMarket = {
      name: 'Market 1',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
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
    expect(res.status).toHaveBeenCalledWith(201); // Ensure response status is 201
    expect(res.send).toHaveBeenCalledWith(`Market created with name: ${newMarket.name}`); // Check send message
  });

  /*
  it('should return a list of all markets', async () => {
    db.data.markets.push({
      id: 1,
      name: 'Market 1',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()  // Mock send
    };

    await responseMarkets(req, res);

    expect(res.status).toHaveBeenCalledWith(200); // Check if status is 200
    expect(res.send).toHaveBeenCalledWith(db.data.markets); // Ensure the markets are sent
  });

  it('should update a market successfully', async () => {
    const market = {
      id: 1,
      name: 'Market 1',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    };

    db.data.markets.push(market); // Add a market to the db

    const updatedMarket = { name: 'Updated Market' };
    const req = { params: { id: '1' }, body: updatedMarket };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()  // Mock send
    };

    await updateMarket(req, res);

    expect(db.data.markets[0].name).toBe('Updated Market'); // Ensure the market name was updated
    expect(res.status).toHaveBeenCalledWith(200); // Check response status
    expect(res.send).toHaveBeenCalledWith(`Market updated with id: 1`); // Check send message
  });

  it('should delete a market successfully', async () => {
    const market = {
      id: 1,
      name: 'Market 1',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      description: 'A great market',
      location: { city: 'City1', address: 'Street1' }
    };

    db.data.markets.push(market); // Add a market to the db

    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()  // Mock send
    };

    await deleteMarket(req, res);

    expect(db.data.markets).toHaveLength(0); // Ensure the market is deleted
    expect(res.status).toHaveBeenCalledWith(200); // Check response status
    expect(res.send).toHaveBeenCalledWith(`Market deleted with id: 1`); // Check send message
  });

  it('should return 404 if market not found', async () => {
    const req = { params: { id: '999' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()  // Mock send
    };

    await deleteMarket(req, res);

    expect(res.status).toHaveBeenCalledWith(404); // Check status for not found
    expect(res.send).toHaveBeenCalledWith('Market not found'); // Check message
  });
  */
});
