import express from 'express';
import cors from 'cors';
import { createProducts, responseProduct, responseProducts, updateProduct, deleteProduct, getProductsByIngredients } from '../controllers/ProductController.js';
import { generateQRCode, scanQRCode } from '../controllers/QRcodeController.js'; // Importeer de nieuwe QRCodeController
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Controleer of de products-microservice draait
 *     responses:
 *       200:
 *         description: De microservice draait correct
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: The products microservice is running
 */
router.get('/', (req, res, next) => {
  res.json('The products microservice is running');
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Maak een nieuw product aan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Naam van het product
 *               inSeason:
 *                 type: boolean
 *                 description: Seizoenstatus van het product
 *               carbonDioxide:
 *                 type: number
 *                 description: CO2-uitstoot van het product
 *     responses:
 *       201:
 *         description: Product succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product created successfully.
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unieke ID van het product
 *                     name:
 *                       type: string
 *                       description: Naam van het product
 *                     inSeason:
 *                       type: boolean
 *                       description: Seizoenstatus van het product
 *                     carbonDioxide:
 *                       type: number
 *                       description: CO2-uitstoot van het product
 */
router.post('/products', createProducts);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Haal alle producten op
 *     responses:
 *       200:
 *         description: Een lijst van alle producten
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unieke ID van het product
 *                   name:
 *                     type: string
 *                     description: Naam van het product
 *                   inSeason:
 *                     type: boolean
 *                     description: Seizoenstatus van het product
 *                   carbonDioxide:
 *                     type: number
 *                     description: CO2-uitstoot van het product
 */
router.get('/products', responseProducts);
router.post('/scan-qr',cors(), scanQRCode);
/**
 * @swagger
 * /products/{param}:
 *   get:
 *     summary: Haal details van een specifiek product op
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID of naam van het product
 *     responses:
 *       200:
 *         description: Details van het product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unieke ID van het product
 *                 name:
 *                   type: string
 *                   description: Naam van het product
 *                 inSeason:
 *                   type: boolean
 *                   description: Seizoenstatus van het product
 *                 carbonDioxide:
 *                   type: number
 *                   description: CO2-uitstoot van het product
 *       404:
 *         description: Product niet gevonden
 */
router.get('/products/:param', responseProduct);

/**
 * @swagger
 * /products/{param}:
 *   put:
 *     summary: Update een specifiek product
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID of naam van het product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nieuwe naam van het product
 *               inSeason:
 *                 type: boolean
 *                 description: Nieuwe seizoenstatus van het product
 *               carbonDioxide:
 *                 type: number
 *                 description: Nieuwe CO2-uitstoot van het product
 *     responses:
 *       200:
 *         description: Product succesvol bijgewerkt
 *       404:
 *         description: Product niet gevonden
 */
router.put('/products/:param', updateProduct);

/**
 * @swagger
 * /products/{param}:
 *   delete:
 *     summary: Verwijder een specifiek product
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID of naam van het product
 *     responses:
 *       200:
 *         description: Product succesvol verwijderd
 *       404:
 *         description: Product niet gevonden
 */
router.delete('/products/:param', deleteProduct);

router.post('/products/:productId/generate-qr',cors(),  generateQRCode);  // Genereer een QR-code voor een product

router.post("/products/by-ingredients", getProductsByIngredients);
export default router;
