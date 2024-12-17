import express from 'express';
import { getRecipes, getRecipeById, getRecipeIngredients, getRecipeInstructions } from '../controllers/recipeController.js';
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Controleer of de recipe-microservice draait
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
 * /recipes:
 *   get:
 *     summary: Haal alle recepten op
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Zoekterm om recepten op te halen
 *       - in: query
 *         name: number
 *         required: false
 *         schema:
 *           type: integer
 *         description: Aantal recepten om op te halen (standaard 10)
 *     responses:
 *       200:
 *         description: Een lijst van alle recepten
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unieke ID van het recept
 *                       title:
 *                         type: string
 *                         description: Naam van het recept
 *                       description:
 *                         type: string
 *                         description: Beschrijving van het recept
 */
router.get('/recipes', getRecipes);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Haal details van een specifiek recept op
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID van het recept
 *     responses:
 *       200:
 *         description: Details van het recept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unieke ID van het recept
 *                 title:
 *                   type: string
 *                   description: Naam van het recept
 *                 description:
 *                   type: string
 *                   description: Beschrijving van het recept
 *       404:
 *         description: Recept niet gevonden
 */
router.get('/recipes/:id', getRecipeById);

/**
 * @swagger
 * /recipes/{id}/instructions:
 *   get:
 *     summary: Haal de instructies van een specifiek recept op
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID van het recept
 *     responses:
 *       200:
 *         description: Instructies van het recept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Stappen van de instructies
 *       404:
 *         description: Instructies niet gevonden
 */
router.get('/recipes/:id/instructions', getRecipeInstructions);

/**
 * @swagger
 * /recipes/{id}/ingredients:
 *   get:
 *     summary: Haal de ingrediënten van een specifiek recept op
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: De unieke ID van het recept
 *     responses:
 *       200:
 *         description: Ingrediënten van het recept
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Naam van het ingrediënt
 *                       quantity:
 *                         type: string
 *                         description: Hoeveelheid van het ingrediënt
 *       404:
 *         description: Ingrediënten niet gevonden
 */
router.get('/recipes/:id/ingredients', getRecipeIngredients);

export default router;
