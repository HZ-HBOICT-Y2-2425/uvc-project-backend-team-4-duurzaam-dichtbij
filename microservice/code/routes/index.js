import express from 'express';
import { getRecipes, getRecipeById, getRecipeIngredients, getRecipeInstructions } from '../controllers/recipeController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);
router.get("/recipes/:id/instructions", getRecipeInstructions);
router.get("/recipes/:id/ingredients", getRecipeIngredients);


export default router;

