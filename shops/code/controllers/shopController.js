// @ts-nocheck
import { JSONFilePreset } from "lowdb/node";
import multer from "multer";
import fetch from "node-fetch";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now() + file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of shops","date": "November 2024"}, shops : [] };
const db = await JSONFilePreset('db.json', defaultData);
const shops = db.data.shops;

async function geocode(address, city) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?street=${address}&city=${city}&format=jsonv2`);
    const json = await res.json();
    if (json.length > 0) {
      return { lat: json[0].lat, lng: json[0].lon };
    } else {
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error(`Error geocoding ${address}, ${city}:`, error);
    return { lat: null, lng: null };
  }
}

export function getAvailableId() {
  if (shops.length === 0) {
    return 1;
  }

  const ids = shops.map(shop => shop.id);
  const availableId = Math.max(...ids) + 1;
  return availableId;
}

export const createShop = [
  upload.single('image'), // Middleware to handle single file upload
  async (req, res) => {
    const id = getAvailableId();
    const address = {
      city: req.body.location.city,
      address: req.body.location.address
    };
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
    const image = req.file ? req.file.path : null;
    const promotions = req.body.promotions ? {
      description: req.body.promotions.description || null,
      endDate: req.body.promotions.endDate || null
    } : { description: null, endDate: null };

    const coords = await geocode(address.address, address.city);

    if (!name || !address.city || !address.address || !userID || !openingHours) {
      return res.status(400).send('Missing required fields');
    } else {
      shops.push({
        id: id,
        name: name,
        location: address,
        phoneNumber: phoneNumber,
        openingHours: openingHours,
        payingMethods: payingMethods,
        image: image,
        userID: userID,
        promotions: promotions,
        lat: coords.lat,
        lng: coords.lng,
        products: []
      });
      await db.write();
      return res.status(201).send('Shop created successfully');
    }
  }
];

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


export const updateShop = [
  upload.single('image'), // Middleware to handle single file upload
  async (req, res) => {
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
      shop.location = {
        city: req.body.location.city || shop.location.city,
        address: req.body.location.address || shop.location.address
      };
      const coords = await geocode(shop.location.address, shop.location.city);
      shop.lat = coords.lat;
      shop.lng = coords.lng;
    }

    if (req.body.phoneNumber) {
      shop.phoneNumber = req.body.phoneNumber;
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
      try {
        shop.payingMethods = JSON.parse(req.body.payingMethods);
      } catch (e) {
        return res.status(400).send('Invalid payingMethods format');
      }
    }

    if (req.body.userID) {
      shop.userID = req.body.userID;
    }

    if (req.file) {
      shop.image = req.file.path;
    }

    if (req.body.promotions) {
      shop.promotions = {
        description: req.body.promotions.description || shop.promotions.description,
        endDate: req.body.promotions.endDate || shop.promotions.endDate
      };
    }

    await db.write();

    res.status(200).send(`Shop with ID: ${id} updated successfully`);
  }
];

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

export async function linkProductToShop(req, res) {
  try {
    const { shopId, productId } = req.params;

    if (!shopId || !productId) {
      return res.status(400).json({ error: "Missing 'shopId' or 'productId'." });
    }

    // Haal de lijst van winkels op via de API van de shops microservice
    const response = await fetch('http://products:3013/products');  // Pas de URL aan naar je shops microservice
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch shops data" });
    }

    const products = await response.json();  // De lijst van shops van de shops microservice

    // Zoek de shop op basis van shopId
    const shop = shops.find(shop => shop.id === Number(shopId));
    const product = products.find(product => product.id === productId);

    if (!shop) {
      return res.status(404).json({ error: `Shop with ID: ${shopId} not found.` });
    }

    if (!product) {
      return res.status(404).json({ error: `Product with ID: ${productId} not found.` });
    }

    // Link product aan de shop
    if (!Array.isArray(shop.products)) {
      shop.products = [];  // Zorg ervoor dat de products-array bestaat
    }

    if (!shop.products.includes(productId)) {
      shop.products.push(productId);
      await db.write();  // Schrijf de veranderingen naar de producten database
    }

    res.status(200).json({
      message: `Product with ID: ${productId} linked to Shop with ID: ${shopId}.`,
      shop,
    });
  } catch (error) {
    console.error("Error linking product to shop:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getShopProducts(req, res) {
  try {
    const { shopId } = req.params;

    // Haal de lijst van winkels op via de API van de shops microservice
    const response = await fetch('http://shops:3014/shops');  // Pas de URL aan naar je shops microservice
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch shops data" });
    }

    const shops = await response.json();  // De lijst van shops van de shops microservice

    // Zoek de shop op basis van shopId
    const shop = shops.find(shop => shop.id === Number(shopId));

    if (!shop) {
      return res.status(404).json({ error: `Shop with ID: ${shopId} not found.` });
    }

    // Haal de producten op via de API van de producten microservice
    const productResponse = await fetch('http://products:3013/products');  // Pas de URL aan naar je products microservice
    if (!productResponse.ok) {
      return res.status(500).json({ error: "Failed to fetch products data" });
    }

    const products = await productResponse.json();  // De lijst van producten van de producten microservice

    // Zoek de producten die gekoppeld zijn aan de shop
    const shopProducts = shop.products.map(productId =>
      products.find(product => product.id === productId)
    );

    res.status(200).json(shopProducts.filter(product => product));  // Filter de niet-bestaande producten eruit
  } catch (error) {
    console.error("Error fetching shop products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function unlinkProductFromShop(req, res) {
  try {
    const { shopId, productId } = req.params;  // Gebruik params in plaats van body

    if (!shopId || !productId) {
      return res.status(400).json({ error: "Missing 'shopId' or 'productId'." });
    }

    // Zoek de shop op basis van shopId uit de lokaal opgeslagen data
    const shop = shops.find(shop => shop.id === Number(shopId));

    if (!shop) {
      return res.status(404).json({ error: `Shop with ID: ${shopId} not found.` });
    }

    // Zorg ervoor dat de products array bestaat in de shop
    if (!Array.isArray(shop.products)) {
      shop.products = [];  // Als er geen array is, maak er dan een lege array van
    }

    // Zoek het productId in de products array van de shop
    const productIndex = shop.products.indexOf(productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: `Product with ID: ${productId} is not linked to Shop with ID: ${shopId}.` });
    }

    // Verwijder het product uit de lijst van gekoppelde producten met splice
    shop.products.splice(productIndex, 1);

    // Schrijf de wijzigingen terug naar de database
    await db.write();

    res.status(200).json({
      message: `Product with ID: ${productId} unlinked from Shop with ID: ${shopId}.`,
      shop,
    });
  } catch (error) {
    console.error("Error unlinking product from shop:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

