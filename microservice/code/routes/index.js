import express from 'express';
import { responseExample, updateExample, responseByIdExample } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import { getRecipes, getRecipeById, getRecipeIngredients, getRecipeInstructions } from '../controllers/recipeController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/example', checkName, responseExample);
router.post('/example', checkName, updateExample);
router.get('/example/:id', checkName, responseByIdExample);
router.get('/recipes', getRecipes);
router.get('/recipes/:id', getRecipeById);
router.get("/recipes/:id/instructions", getRecipeInstructions);
router.get("/recipes/:id/ingredients", getRecipeIngredients);


export default router;