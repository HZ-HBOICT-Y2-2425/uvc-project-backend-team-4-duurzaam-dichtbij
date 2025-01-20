import { JSONFilePreset } from "lowdb/node";
import { v4 as uuidv4 } from 'uuid';
// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of products","date": "November 2024"}, products : [] };
const db = await JSONFilePreset('db.json', defaultData);
const products = db.data.products;
export async function createProducts(req, res) {
  try {
    const { name, inSeason, carbonDioxide } = req.body;
    if (!name || inSeason === undefined || carbonDioxide === undefined) {
      return res.status(400).json({
        error: "Missing required fields: 'name', 'inSeason', 'carbonDioxide'.",
      });
    }  

    const newProduct = {
      id: uuidv4(),
      name,
      inSeason,
      carbonDioxide,
    };

    products.push(newProduct);
    await db.write(); 
    

    res.status(201).json({
      message: `Product created successfully.`,
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function responseProducts(req, res) {
  try {
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function responseProduct(req, res) {
  try {
    const param = req.params.param;
    const product = products.find(
      (product) => product.id === param || product.name === param
    );

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: `Product not found for parameter: ${param}` });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}


export async function updateProduct(req, res) {
  try {
    const { param } = req.params; 
    const { name, inSeason, carbonDioxide } = req.body; 

   
    const productIndex = products.findIndex((product) => product.id === param || product.name === param);

    if (productIndex === -1) {
      return res.status(404).json({ error: `Product with ID: ${param} not found.` });
    }
    if (name !== undefined) products[productIndex].name = name;
    if (inSeason !== undefined) products[productIndex].inSeason = inSeason;
    if (carbonDioxide !== undefined)products[productIndex].carbonDioxide = carbonDioxide;

    await db.write(); 
    res.status(200).json({
      message: `Product with ID: ${param} updated successfully.`,
      product: products[productIndex],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { param } = req.params; 
    const productIndex = products.findIndex(
      (product) => product.id === param || product.name === param
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: `Product with identifier: ${param} not found.` });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    await db.write(); 

    res.status(200).json({
      message: `Product with identifier: ${param} deleted successfully.`,
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getProductsByIngredients(req, res) {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid ingredients format." });
    }

    const matchingProducts = products.filter((product) =>
      ingredients.includes(product.name.toLowerCase())
    );

    res.status(200).json(matchingProducts);
  } catch (error) {
    console.error("Error fetching products by ingredients:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}