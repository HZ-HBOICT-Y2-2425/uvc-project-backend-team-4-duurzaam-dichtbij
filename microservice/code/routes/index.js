import express from 'express';
import { getRecipes, getRecipeById, getRecipeIngredients, getRecipeInstructions } from '../controllers/recipeController.js';
const router = express.Router();

// Basisroute
router.get('/', (req, res) => {
  res.json('hi');
});

export default router;
// Routes zonder cacheMiddleware
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);
router.get("/recipes/:id/instructions", getRecipeInstructions);
router.get("/recipes/:id/ingredients", getRecipeIngredients);
