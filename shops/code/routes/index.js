import express from 'express';
import { createShop, deleteShop, responseShop, responseShops, updateShop } from '../controllers/shopController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const router = express.Router();
/**
 * @swagger
 * /:
 *   get:
 *     summary: Controleer of de shop-microservice draait
 *     responses:
 *       200:
 *         description: Microservice draait correct
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: hi
 */
router.get('/', (req, res, next) => {
  res.json('hi');
});

/**
 * @swagger
 * /shops:
 *   get:
 *     summary: Haal alle winkels op
 *     responses:
 *       200:
 *         description: Een lijst van winkels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: Unieke ID van de winkel
 *                   name:
 *                     type: string
 *                     description: Naam van de winkel
 *                   location:
 *                     type: object
 *                     properties:
 *                       city:
 *                         type: string
 *                         description: Stad waar de winkel is gevestigd
 *                       address:
 *                         type: string
 *                         description: Adres van de winkel
 *                   phoneNumber:
 *                     type: string
 *                     description: Telefoonnummer van de winkel
 *                   openingHours:
 *                     type: object
 *                     properties:
 *                       monday:
 *                         type: string
 *                         description: Openingstijd maandag
 *                       tuesday:
 *                         type: string
 *                         description: Openingstijd dinsdag
 *                       wednesday:
 *                         type: string
 *                         description: Openingstijd woensdag
 *                       thursday:
 *                         type: string
 *                         description: Openingstijd donderdag
 *                       friday:
 *                         type: string
 *                         description: Openingstijd vrijdag
 *                       saturday:
 *                         type: string
 *                         description: Openingstijd zaterdag
 *                       sunday:
 *                         type: string
 *                         description: Openingstijd zondag
 */
router.get('/shops', checkName, responseShops);

/**
 * @swagger
 * /shops:
 *   post:
 *     summary: Maak een nieuwe winkel aan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Naam van de winkel
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: Stad waar de winkel is gevestigd
 *                   address:
 *                     type: string
 *                     description: Adres van de winkel
 *               phoneNumber:
 *                 type: string
 *                 description: Telefoonnummer van de winkel
 *               openingHours:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: string
 *                     description: Openingstijd maandag
 *                   tuesday:
 *                     type: string
 *                     description: Openingstijd dinsdag
 *                   wednesday:
 *                     type: string
 *                     description: Openingstijd woensdag
 *                   thursday:
 *                     type: string
 *                     description: Openingstijd donderdag
 *                   friday:
 *                     type: string
 *                     description: Openingstijd vrijdag
 *                   saturday:
 *                     type: string
 *                     description: Openingstijd zaterdag
 *                   sunday:
 *                     type: string
 *                     description: Openingstijd zondag
 *               payingMethods:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Betalingsmethoden van de winkel
 *               userID:
 *                 type: string
 *                 description: De ID van de gebruiker die de winkel aanmaakt
 *     responses:
 *       201:
 *         description: Winkel succesvol aangemaakt
 */
router.post('/shops', checkName, createShop);

/**
 * @swagger
 * /uploads/{filename}:
 *   get:
 *     summary: Download een bestand uit uploads
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Naam van het te downloaden bestand
 *     responses:
 *       200:
 *         description: Bestand succesvol gedownload
 *       404:
 *         description: Bestand niet gevonden
 */
router.get('/uploads/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filepath = path.join(_dirname, '../uploads', filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.sendFile(filepath);
  });
});

/**
 * @swagger
 * /shop/{param}:
 *   get:
 *     summary: Haal details op van een specifieke winkel
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID of naam van de winkel
 *     responses:
 *       200:
 *         description: Details van de winkel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   description: Unieke ID van de winkel
 *                 name:
 *                   type: string
 *                   description: Naam van de winkel
 *                 location:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                       description: Stad waar de winkel is gevestigd
 *                     address:
 *                       type: string
 *                       description: Adres van de winkel
 *                 phoneNumber:
 *                   type: string
 *                   description: Telefoonnummer van de winkel
 *                 openingHours:
 *                   type: object
 *                   properties:
 *                     monday:
 *                       type: string
 *                     tuesday:
 *                       type: string
 *                     wednesday:
 *                       type: string
 *                     thursday:
 *                       type: string
 *                     friday:
 *                       type: string
 *                     saturday:
 *                       type: string
 *                     sunday:
 *                       type: string
 *       404:
 *         description: Winkel niet gevonden
 */
router.get('/shop/:param', checkName, responseShop);

/**
 * @swagger
 * /shop/{id}:
 *   put:
 *     summary: Update een winkel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID van de winkel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: De nieuwe naam van de winkel
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: De nieuwe stad van de winkel
 *                   address:
 *                     type: string
 *                     description: Het nieuwe adres van de winkel
 *               phoneNumber:
 *                 type: string
 *                 description: Het nieuwe telefoonnummer van de winkel
 *               openingHours:
 *                 type: object
 *                 properties:
 *                   monday:
 *                     type: string
 *                   tuesday:
 *                     type: string
 *                   wednesday:
 *                     type: string
 *                   thursday:
 *                     type: string
 *                   friday:
 *                     type: string
 *                   saturday:
 *                     type: string
 *                   sunday:
 *                     type: string
 *               payingMethods:
 *                 type: array
 *                 items:
 *                   type: string
 *               userID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Winkel succesvol geüpdatet
 *       404:
 *         description: Winkel niet gevonden
 */
router.put('/shop/:id', checkName, updateShop);

/**
 * @swagger
 * /shop/{id}:
 *   delete:
 *     summary: Verwijder een winkel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID van de winkel
 *     responses:
 *       200:
 *         description: Winkel succesvol verwijderd
 *       404:
 *         description: Winkel niet gevonden
 */
router.delete('/shop/:id', checkName, deleteShop);

export default router;