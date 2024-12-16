import { jest } from '@jest/globals';
import { getDB, setDB } from '../controllers/eventController.js';
import supertest from 'supertest';
import { app, server } from '../start.js';
import { Low, Memory } from 'lowdb';
import e from 'express';

// Default data used in the controller
const defaultData = { meta: { "tile": "List of events", "date": "December 2024" }, events: [], nextId: 1 };
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
  db.data.events = [];
  await db.write();
  setDB(oldDb);
});

afterAll(() => {
  server.close(); // Ensure the server shuts down
});

describe('Event Controller', () => {

  it('should create an event with valid data', async () => {
    const newEvent = {
      name: 'Event 1',
      type: 'Boodschappen',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great event',
      location: { city: 'City1', address: 'Street1' }
    };

    const res = await supertest(app)
      .post('/events')
      .send(newEvent)
      .set('Accept', 'application/json');
    
    expect(db.data.events).toHaveLength(1);
    expect(db.data.events[0].name).toBe('Event 1');
    expect(res.status).toBe(201);
    expect(res.text).toBe(`Event created with name: ${newEvent.name}`);
  });

  it('should return a list of all events', async () => {
    const res = await supertest(app).get('/events');

    expect(res.status).toBe(200); // Ensure response status is 200
    expect(res.body).toEqual(db.data.events); // Ensure the response body matches the database
  });

  it('should update an event successfully', async () => {
    const event = {
      name: 'Event 1',
      type: 'Kookgroep',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great event',
      location: { city: 'City1', address: 'Street1' }
    };

    const res1 = await supertest(app)
      .post('/events')
      .send(event)
      .set('Accept', 'application/json');

    expect(res1.status).toBe(201);
    expect(db.data.events).toHaveLength(1);
    expect(db.data.events[0].name).toBe('Event 1');
    expect(res1.text).toBe(`Event created with name: ${event.name}`);


    const updatedEvent = {
      name: 'Event 2',
      type: 'Boodschappen',
      startDate: '2024-12-30T17:00:00.000Z',
      endDate: '2024-12-30T23:00:00.000Z',
      description: 'An even better event',
      location: { city: 'City2', address: 'Street2' }
    };

    const res2 = await supertest(app)
      .put('/event/1')
      .send(updatedEvent)
      .set('Accept', 'application/json');

    expect(db.data.events[0].name).toBe('Event 2');
    expect(db.data.events).toHaveLength(1);
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(`Event updated with id: 1`);
  });

  it('should delete an event successfully', async () => {
    const event = {
      name: 'Event 1',
      type: 'Boodschappen',
      startDate: '2024-12-30T13:00:00.000Z',
      endDate: '2024-12-30T17:00:00.000Z',
      description: 'A great event',
      location: { city: 'City1', address: 'Street1' }
    };

    const res1 = await supertest(app)
      .post('/events')
      .send(event)
      .set('Accept', 'application/json');

    expect(res1.status).toBe(201);
    expect(db.data.events).toHaveLength(1);
    expect(db.data.events[0].name).toBe('Event 1');
    expect(res1.text).toBe(`Event created with name: ${event.name}`);

    const res2 = await supertest(app).delete('/event/1');

    expect(db.data.events).toHaveLength(0);
    expect(res2.status).toBe(200);
    expect(res2.text).toBe(`Event deleted with id: 1`);
  });

  it('should return 404 if event not found', async () => {
    const res = await supertest(app).get('/event/1');

    expect(res.status).toBe(404); // Ensure response status is 404
    expect(res.text).toBe('Event not found'); // Check send message
  });
});
