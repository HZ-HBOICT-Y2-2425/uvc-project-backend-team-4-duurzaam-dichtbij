import express from 'express';
import { createMarket, responseMarkets, responseMarket, updateMarket, deleteMarket } from '../controllers/marketController.js';
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Controleer of de market-microservice draait
 *     responses:
 *       200:
 *         description: Microservice draait correct
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "The markets microservice is running"
 */
router.get('/', (req, res, next) => {
  res.json('The markets microservice is running');
});

/**
 * @swagger
 * /markets:
 *   post:
 *     summary: Maak een nieuwe markt aan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Naam van de markt
 *               dayOfWeek:
 *                 type: string
 *                 description: Dag van de week waarop de markt plaatsvindt (bijv. maandag, dinsdag)
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: Starttijd van de markt in HH:mm formaat
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: Eindtijd van de markt in HH:mm formaat
 *               description:
 *                 type: string
 *                 description: Beschrijving van de markt
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Stad van de markt
 *                   address:
 *                     type: string
 *                     description: Adres van de markt
 *     responses:
 *       201:
 *         description: Markt succesvol aangemaakt
 *       400:
 *         description: Ongeldige invoer
 */
router.post('/markets', createMarket);

/**
 * @swagger
 * /markets:
 *   get:
 *     summary: Haal alle markten op
 *     responses:
 *       200:
 *         description: Een lijst van markten
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Unieke ID van de markt
 *                   name:
 *                     type: string
 *                     description: Naam van de markt
 *                   location:
 *                     type: string
 *                     description: Locatie van de markt
 *                   dayOfWeek:
 *                     type: string
 *                     description: Dag van de week waarop de markt plaatsvindt
 *                   startTime:
 *                     type: string
 *                     format: time
 *                     description: Starttijd van de markt
 *                   endTime:
 *                     type: string
 *                     format: time
 *                     description: Eindtijd van de markt
 *                   description:
 *                     type: string
 *                     description: Beschrijving van de markt
 *                   verified:
 *                     type: boolean
 *                     description: Of de markt geverifieerd is
 */
router.get('/markets', responseMarkets);

/**
 * @swagger
 * /market/{param}:
 *   get:
 *     summary: Haal details op van een specifieke markt
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: Unieke parameter van de markt (bijv. naam of ID)
 *     responses:
 *       200:
 *         description: Details van de markt
 *       404:
 *         description: Markt niet gevonden
 */
router.get('/market/:param', responseMarket);

/**
 * @swagger
 * /market/{id}:
 *   put:
 *     summary: Update een markt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID van de markt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: De nieuwe naam van de markt
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: De nieuwe stad van de markt
 *                   address:
 *                     type: string
 *                     description: Het nieuwe adres van de markt
 *               dayOfWeek:
 *                 type: string
 *                 description: Nieuwe dag van de week
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: Nieuwe starttijd van de markt
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: Nieuwe eindtijd van de markt
 *               description:
 *                 type: string
 *                 description: Nieuwe beschrijving van de markt
 *               verified:
 *                 type: boolean
 *                 description: Of de markt geverifieerd is
 *     responses:
 *       200:
 *         description: Markt succesvol geüpdatet
 *       404:
 *         description: Markt niet gevonden
 */
router.put('/market/:id', updateMarket);

/**
 * @swagger
 * /market/{id}:
 *   delete:
 *     summary: Verwijder een markt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID van de markt
 *     responses:
 *       200:
 *         description: Markt succesvol verwijderd
 *       404:
 *         description: Markt niet gevonden
 */
router.delete('/market/:id', deleteMarket);

export default router;
