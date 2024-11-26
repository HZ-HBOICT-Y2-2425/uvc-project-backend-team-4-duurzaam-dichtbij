import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of shops","date": "November 2024"}, shops : [] }
const db = await JSONFilePreset('db.json', defaultData)
const shops = db.data.shops;

export function getAvailableId() {
  if (shops.length === 0) {
    return 1;
  }

  const ids = shops.map(shop => shop.id);
  const availableId = Math.max(...ids) + 1;
  return availableId;
}

export async function createShop(req, res) {
  const id = getAvailableId();
  const address = {
    city: req.body.location.city,
    address: req.body.location.address
  }
  const name = req.body.name;
  const phoneNumber = req.body.phonenumber;
  const openingHours = {
    monday: req.body.openingHours.monday || 'closed',
    tuesday: req.body.openingHours.tuesday || 'closed',
    wednesday: req.body.openingHours.wednesday || 'closed',
    thursday: req.body.openingHours.thursday || 'closed',
    friday: req.body.openingHours.friday || 'closed',
    saturday: req.body.openingHours.saturday || 'closed',
    sunday: req.body.openingHours.sunday || 'closed'
  };
  const payingMethods = req.body.payingMethods;
  const userID = req.body.userID;

  if (!name || !address.city || !address.address || !userID || !openingHours) {
    return res.status(400).send('Missing required fields');
  } else {
    shops.push({
      id: id,
      name: name,
      address: address,
      phoneNumber: phoneNumber,
      openingHours: openingHours,
      payingMethods: payingMethods,
      userID: userID
    });
    await db.write();

    res.status(201).send(`Shop created with name: ${name} `);
  }
}
/**
 * aquire list of shops
 * @param {*} req 
 * @param {*} res 
 */
export async function responseShops(req, res) {
  res.status(200).send(shops);
}

/**
 * this function returns a shop by id or name
 * @param {*} param 
 */
export async function responseShop(req, res) {
  const param = req.params.param;
  const shop = shops.find(shop => shop.id === Number(param) || shop.name === param);

  if (shop) {
    res.status(200).send(shop);
  } else {
    res.status(404).send('Shop not found');
  }
}


export async function updateShop(req, res) {
  const id = parseInt(req.params.id); // Extract the shop ID from the URL parameter
  const shop = shops.find(shop => shop.id === id); // Find the shop by ID

  if (!shop) {
    return res.status(404).send(`Shop with ID: ${id} not found`);
  }

  // Update shop attributes based on the request body
  if (req.body.name) {
    shop.name = req.body.name;
  }

  if (req.body.location) {
    shop.address = {
      city: req.body.location.city || shop.address.city,
      address: req.body.location.address || shop.address.address
    };
  }

  if (req.body.phonenumber) {
    shop.phoneNumber = req.body.phonenumber;
  }

  if (req.body.openingHours) {
    shop.openingHours = {
      monday: req.body.openingHours.monday || shop.openingHours.monday,
      tuesday: req.body.openingHours.tuesday || shop.openingHours.tuesday,
      wednesday: req.body.openingHours.wednesday || shop.openingHours.wednesday,
      thursday: req.body.openingHours.thursday || shop.openingHours.thursday,
      friday: req.body.openingHours.friday || shop.openingHours.friday,
      saturday: req.body.openingHours.saturday || shop.openingHours.saturday,
      sunday: req.body.openingHours.sunday || shop.openingHours.sunday
    };
  }

  if (req.body.payingMethods) {
    shop.payingMethods = req.body.payingMethods;
  }

  if (req.body.userID) {
    shop.userID = req.body.userID;
  }
  await db.write();

  res.status(200).send(`Shop with ID: ${id} updated successfully`);
}

export async function deleteShop(req, res) {
  const id = req.params.id;
  const shop = shops.find(shop => shop.id === Number(id));

  if (shop) {
    shops.splice(shops.indexOf(shop), 1);
    await db.write();

    res.status(200).send(`Shop deleted with id: ${id}`);
  } else {
    res.status(404).send('Shop not found');
  }
}