import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { 
  meta: { "title": "List of markets", "date": "December 2024" }, 
  markets: [], 
  nextId: 1 
};
let db = await JSONFilePreset('db.json', defaultData);
let markets = db.data.markets;
const allMarketIds = markets.map(market => market.id);

export function getDB() {
  if (db === undefined) {
    throw new Error('Wait for the database to load...');
  }
  return db;
}
export function setDB(newDb) {
  db = newDb;
  markets = newDb.data.markets;
}

// Regex for validating time in HH:mm format (24-hour format)
const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;

export async function createMarket(req, res) {
  const id = db.data.nextId;
  db.data.nextId += 1;

  const name = req.body.name;
  const dayOfWeek = req.body.dayOfWeek;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const description = req.body.description;
  const verified = false;

  if (!req.body.location || !req.body.location.city || !req.body.location.address) {
    return res.status(400).send('Missing location fields');
  }

  const location = {
    city: req.body.location.city,
    address: req.body.location.address
  };

  const comments = [];

  if (!name || !dayOfWeek || !startTime || !endTime || !description) {
    return res.status(400).send('Missing required fields');
  } else if (
    !['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].includes(dayOfWeek)
  ) {
    return res.status(400).send('Invalid day of week');
  } else if (!timeRegex.test(startTime)) {
    return res.status(400).send('Invalid start time format, must be HH:mm');
  } else if (!timeRegex.test(endTime)) {
    return res.status(400).send('Invalid end time format, must be HH:mm');
  } else if (startTime >= endTime) {
    return res.status(400).send('End time must be after start time');
  } else {
    markets.push({
      id,
      name,
      dayOfWeek,
      startTime,
      endTime,
      description,
      location,
      verified,
      comments
    });

    await db.write();

    res.status(201).send(`Market created with name: ${name}`);
  }
}

export async function responseMarkets(req, res) {
  res.status(200).send(markets);
}

export async function responseMarket(req, res) {
  const param = req.params.param;
  const market = markets.find(market => market.id === Number(param) || market.name === param);

  if (market) {
    res.status(200).send(market);
  } else {
    res.status(404).send('Market not found');
  }
}

export async function updateMarket(req, res) {
  const id = Number(req.params.id);
  const market = markets.find((market) => market.id === id);

  if (!market) {
    return res.status(404).send('Market not found');
  }

  const { name, dayOfWeek, startTime, endTime, description, verified, location } = req.body;

  // Validate `dayOfWeek` if provided
  if (dayOfWeek && !['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].includes(dayOfWeek)) {
    return res.status(400).send('Invalid day of week');
  }

  // Validate `startTime` if provided
  if (startTime && !timeRegex.test(startTime)) {
    return res.status(400).send('Invalid start time format, must be HH:mm');
  }

  // Validate `endTime` if provided
  if (endTime && !timeRegex.test(endTime)) {
    return res.status(400).send('Invalid end time format, must be HH:mm');
  }

  // Ensure `endTime` is after `startTime` if both are provided
  if (startTime && endTime && startTime >= endTime) {
    return res.status(400).send('End time must be after start time');
  }

  if (verified !== undefined && typeof verified !== 'boolean') {
    return res.status(400).send('Verified must be a boolean');
  }

  // Validate `location` if provided
  if (location) {
    if (location.city === undefined || location.address === undefined) {
      return res.status(400).send('Location must include both city and address');
    }
  }

  // Update fields if validation passes
  if (name) market.name = name;
  if (dayOfWeek) market.dayOfWeek = dayOfWeek;
  if (startTime) market.startTime = startTime;
  if (endTime) market.endTime = endTime;
  if (description) market.description = description;
  if (verified !== undefined) market.verified = verified;
  if (location) {
    if (location.city) market.location.city = location.city;
    if (location.address) market.location.address = location.address;
  }

  await db.write();

  res.status(200).send(`Market updated with id: ${id}`);
}

export async function deleteMarket(req, res) {
  const id = req.params.id;
  const market = markets.find(market => market.id === Number(id));

  if (market) {
    markets.splice(markets.indexOf(market), 1);
    await db.write();

    res.status(200).send(`Market deleted with id: ${id}`);
  } else {
    res.status(404).send('Market not found');
  }
}