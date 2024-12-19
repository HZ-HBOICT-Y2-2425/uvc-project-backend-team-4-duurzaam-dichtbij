import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { 
  meta: { "title": "List of events", "date": "December 2024" }, 
  events: [], 
  nextId: 1 
};
let db = await JSONFilePreset('db.json', defaultData);
let events = db.data.events;

export function getDB() {
  if (db === undefined) {
    throw new Error('Wait for the database to load...');
  }
  return db;
}
export function setDB(newDb) {
  db = newDb;
  events = newDb.data.events;
}

export async function createEvent(req, res) {
  const id = db.data.nextId;
  db.data.nextId += 1;
  
  const name = req.body.name;
  const type = req.body.type;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const location = {
    city: req.body.location.city,
    address: req.body.location.address
  };
  const appliedUsers = [];
  const comments = [];

  if (!name || !type || !startDate || !endDate || !description || !location.city || !location.address) {
    return res.status(400).send('Missing required fields');
  } else if (isNaN(new Date(startDate).getTime())) {
    return res.status(400).send('Invalid start date');
  } else if (isNaN(new Date(endDate).getTime())) {
    return res.status(400).send('Invalid end date');
  } else if (new Date(startDate) < new Date()) {
    return res.status(400).send('Start date must be in the future');
  } else if (new Date(endDate) < new Date()) {
    return res.status(400).send('End date must be in the future');
  } else if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).send('End date must be after start date');
  } else {
    events.push({
      id: id,
      name: name,
      type: type,
      startDate: startDate,
      endDate: endDate,
      description: description,
      location: location,
      appliedUsers: appliedUsers,
      comments: comments
    });
    await db.write();

    res.status(201).send(`Event created with name: ${name}`);
  }
}

export async function responseEvents(req, res) {
  res.status(200).send(events);
}

export async function responseEvent(req, res) {
  const param = req.params.param;
  const event = events.find(event => event.id === Number(param) || event.name === param);

  if (event) {
    res.status(200).send(event);
  } else {
    res.status(404).send('Event not found');
  }
}


export async function updateEvent(req, res) {
  const id = req.params.id;
  const event = events.find(event => event.id === Number(id));

  if (event) {
    if (req.body.name) {
      event.name = req.body.name;
    }
    if (req.body.type) {
      event.type = req.body.type;
    }
    if (req.body.startDate) {
      if (isNaN(new Date(req.body.startDate).getTime())) {
        return res.status(400).send('Invalid start date');
      } else if (new Date(req.body.startDate) < new Date()) {
        return res.status(400).send('Start date must be in the future');
      } else {
        event.startDate = req.body.startDate;
      }
    }
    if (req.body.endDate) {
      if (isNaN(new Date(req.body.endDate).getTime())) {
        return res.status(400).send('Invalid end date');
      } else if (new Date(req.body.endDate) < new Date()) {
        return res.status(400).send('End date must be in the future');
      } else {
        event.endDate = req.body.endDate;
      }
    }
    if (req.body.description) {
      event.description = req.body.description;
    }
    if (req.body.location) {
      if (req.body.location.city) {
        event.location.city = req.body.location.city;
      }
      if (req.body.location.address) {
        event.location.address = req.body.location.address;
      }
    }
    await db.write();

    res.status(200).send(`Event updated with id: ${id}`);
  } else {
    res.status(404).send('Event not found');
  }
}


export async function deleteEvent(req, res) {
  const id = req.params.id;
  const event = events.find(event => event.id === Number(id));

  if (event) {
    events.splice(events.indexOf(event), 1);
    await db.write();

    res.status(200).send(`Event deleted with id: ${id}`);
  } else {
    res.status(404).send('Event not found');
  }
}

export async function isAppliedEvent(req, res) {
  if (!req.params.user) {
    return res.status(400).send('Missing required fields');
  } else if (!events.find(event => event.id === Number(req.params.id))) {
    return res.status(404).send('Event not found');
  } else if (events.find(event => event.id === Number(req.params.id)).appliedUsers.includes(Number(req.params.user))) {
    return res.status(200).send(true);
  } else {
    return res.status(200).send(false);
  }
}

export async function applyEvent(req, res) {
  if (!req.body.user) {
    return res.status(400).send('Missing required fields');
  } else if (!events.find(event => event.id === Number(req.params.id))) {
    return res.status(404).send('Event not found');
  } else if (events.find(event => event.id === Number(req.params.id)).appliedUsers.includes(req.body.user)) {
    return res.status(400).send('User already applied');
  } else if (events.find(event => event.id === Number(req.params.id)).startDate < new Date()) {
    return res.status(400).send('Event already started');
  } else if (events.find(event => event.id === Number(req.params.id)).endDate < new Date()) {
    return res.status(400).send('Event already ended');
  } else {
    events.find(event => event.id === Number(req.params.id)).appliedUsers.push(req.body.user);
    await db.write();

    res.status(200).send(`User ${req.body.user} applied for event with id: ${req.params.id}`);
  }
}

export async function deApplyEvent(req, res) {
  if (!req.body.user) {
    return res.status(400).send('Missing required fields');
  } else if (!events.find(event => event.id === Number(req.params.id))) {
    return res.status(404).send('Event not found');
  } else if (!events.find(event => event.id === Number(req.params.id)).appliedUsers.includes(req.body.user)) {
    return res.status(400).send('User not applied');
  } else {
    events.find(event => event.id === Number(req.params.id)).appliedUsers.splice(events.find(event => event.id === Number(req.params.id)).appliedUsers.indexOf(req.body.user), 1);
    await db.write();

    res.status(200).send(`User ${req.body.user} de-applied for event with id: ${req.params.id}`);
  }
}