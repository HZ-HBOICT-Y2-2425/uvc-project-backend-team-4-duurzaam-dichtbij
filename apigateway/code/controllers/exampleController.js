import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of animals","date": "September 2024"}, animals : [] };
const db = await JSONFilePreset('db.json', defaultData);
const animals = db.data.animals;

export async function responseExample(req, res) {
  res.status(200).send(animals);
}

export async function updateExample(req, res) {
  // fixme check if id exists
  const id = req.query.id;
  const name = req.query.name;
  const type = req.query.type;
  const time = new Date().toLocaleString();
  const animal = {id: id, name: name, type: type, time: time};  
  // todo remove log
  console.log(animal);
  animals.push(animal);
  await db.write();

  res.status(201).send(`I added this client: ${JSON.stringify(animal)}?`);
}

export async function responseByIdExample(req, res) {
  const id = req.params.id;
  const animal = animals.find(animal => animal.id === id);
  if (animal) {
    res.status(200).send(animal);
  } else {
    res.status(404).send('Animal not found');
  }
}
