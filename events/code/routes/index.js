import express from 'express';
import { applyEvent, createEvent, deApplyEvent, deleteEvent, isAppliedEvent, responseEvent, responseEvents, updateEvent } from '../controllers/eventController.js';

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Controleer of de microservice draait
 *     responses:
 *       200:
 *         description: De microservice draait correct
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.get('/', (req, res, next) => {
  res.json('The events microservice is running');
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Maak een nieuw evenement aan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Naam van het evenement
 *               type:
 *                 type: string
 *                 description: Type van het evenement
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Startdatum van het evenement
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Einddatum van het evenement
 *               description:
 *                 type: string
 *                 description: Beschrijving van het evenement
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Stad van het evenement
 *                   address:
 *                     type: string
 *                     description: Adres van het evenement
 *     responses:
 *       201:
 *         description: Evenement succesvol aangemaakt
 *       400:
 *         description: Fout bij het aanmaken van evenement (bijvoorbeeld ontbrekende velden)
 */
router.post('/events', createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Haal alle evenementen op
 *     responses:
 *       200:
 *         description: Lijst van alle evenementen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID van het evenement
 *                   name:
 *                     type: string
 *                     description: Naam van het evenement
 *                   type:
 *                     type: string
 *                     description: Type van het evenement
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     description: Startdatum van het evenement
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     description: Einddatum van het evenement
 *                   description:
 *                     type: string
 *                     description: Beschrijving van het evenement
 *                   location:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         description: Stad van het evenement
 *                       address:
 *                         type: string
 *                         description: Adres van het evenement
 *       404:
 *         description: Geen evenementen gevonden
 */
router.get('/events', responseEvents);

/**
 * @swagger
 * /event/{param}:
 *   get:
 *     summary: Haal details op van een specifiek evenement
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: Een unieke parameter (bijvoorbeeld naam of ID)
 *     responses:
 *       200:
 *         description: Details van het specifieke evenement
 *       404:
 *         description: Evenement niet gevonden
 */
router.get('/event/:param', responseEvent);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Update een bestaand evenement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van het evenement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: De nieuwe naam van het evenement
 *               type:
 *                 type: string
 *                 description: Het nieuwe type van het evenement
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: De nieuwe startdatum van het evenement
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: De nieuwe einddatum van het evenement
 *               description:
 *                 type: string
 *                 description: De nieuwe beschrijving van het evenement
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: De nieuwe stad van het evenement
 *                   address:
 *                     type: string
 *                     description: Het nieuwe adres van het evenement
 *     responses:
 *       200:
 *         description: Evenement succesvol geüpdatet
 *       400:
 *         description: Ongeldige invoer
 *       404:
 *         description: Evenement niet gevonden
 */
router.put('/event/:id', updateEvent);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Verwijder een evenement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van het evenement
 *     responses:
 *       200:
 *         description: Evenement succesvol verwijderd
 *       404:
 *         description: Evenement niet gevonden
 */
router.delete('/event/:id', deleteEvent);

/**
 * @swagger
 * /events/{id}/apply/{user}:
 *   get:
 *     summary: Controleer of een gebruiker is aangemeld voor een evenement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van het evenement
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van de gebruiker zijn account
 *     responses:
 *       200:
 *         description: Gebruiker is aangemeld voor het evenement
 *       400:
 *         description: Ongeldige invoer
 *       404:
 *         description: Evenement niet gevonden of gebruiker is niet aangemeld voor het evenement
 */
router.get('/events/:id/apply/:user', isAppliedEvent);

/**
 * @swagger
 * /events/{id}/apply:
 *   post:
 *     summary: Meld je aan voor een evenement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van het evenement
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *             type: integer
 *             description: ID van de gebruiker zijn account
 *     responses:
 *       200:
 *         description: Aanmelding succesvol
 *       400:
 *         description: Ongeldige invoer
 *       404:
 *         description: Evenement niet gevonden
 */
router.post('/events/:id/apply', applyEvent);

/**
 * @swagger
 * /events/{id}/apply:
 *   delete:
 *     summary: Meld je af voor een evenement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID van het evenement
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            user:
 *             type: integer
 *             description: ID van de gebruiker zijn account
 *     responses:
 *       200:
 *         description: Afmelding succesvol
 *       400:
 *         description: Ongeldige invoer
 *       404:
 *         description: Evenement niet gevonden
 */
router.delete('/events/:id/apply', deApplyEvent);

export default router;
