import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of markets","date": "November 2024"}, markets : [] };
let db = await JSONFilePreset('db.json', defaultData);
let markets = db.data.markets;

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

export async function createMarket(req, res) {
  const id = markets.length + 1;
  const name = req.body.name;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const location = {
    city: req.body.location.city,
    address: req.body.location.address
  };
  const comments = [];

  if (!name || !startDate || !endDate || !description || !location.city || !location.address) {
    return res.status(400).send('Missing required fields');
  } else if (isNaN(new Date(startDate).getTime())) {
    return res.status(400).send('Invalid start date');
  } else if (isNaN(new Date(endDate).getTime())) {
    return res.status(400).send('Invalid end date');
  } else if (new Date(startDate) < new Date()) {
    return res.status(400).send('Start date must be in the future');
  } else if (new Date(endDate) < new Date()) {
    return res.status(400).send('End date must be in the future');
  } else {
    markets.push({
      id: id,
      name: name,
      startDate: startDate,
      endDate: endDate,
      description: description,
      location: location,
      comments: comments
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
  const id = req.params.id;
  const market = markets.find(market => market.id === Number(id));

  if (market) {
    if (req.body.name) {
      market.name = req.body.name;
    }
    if (req.body.startDate) {
      if (isNaN(new Date(req.body.startDate).getTime())) {
        return res.status(400).send('Invalid start date');
      } else if (new Date(req.body.startDate) < new Date()) {
        return res.status(400).send('Start date must be in the future');
      } else {
        market.startDate = req.body.startDate;
      }
    }
    if (req.body.endDate) {
      if (isNaN(new Date(req.body.endDate).getTime())) {
        return res.status(400).send('Invalid end date');
      } else if (new Date(req.body.endDate) < new Date()) {
        return res.status(400).send('End date must be in the future');
      } else {
        market.endDate = req.body.endDate;
      }
    }
    if (req.body.description) {
      market.description = req.body.description;
    }
    if (req.body.city) {
      market.location.city = req.body.city;
    }
    if (req.body.address) {
      market.location.address = req.body.address;
    }
    await db.write();

    res.status(200).send(`Market updated with id: ${id}`);
  } else {
    res.status(404).send('Market not found');
  }
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