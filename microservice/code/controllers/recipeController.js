import axios from "axios";
import dotenv from 'dotenv';

dotenv.config({ path: 'variables.env' });

const RECIPE_API_URL = "https://api.spoonacular.com/recipes";
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;

const apiClient = axios.create({
  baseURL: RECIPE_API_URL,
  params: {
    apiKey: RECIPE_API_KEY
  }
});

// Fetch all recipes with a search term
export async function getRecipes(req, res) {
  const query = req.query.query; 
  const number = req.query.number || 10; 

  try {
    const response = await apiClient.get('/complexSearch', {
      params: {
        number: number,
        ...(query && { query }) 
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching recipes." });
  }
}

// Fetch specific recipe details by ID
export async function getRecipeById(req, res) {
  const recipeId = req.params.id;

  try {
    const response = await apiClient.get(`/${recipeId}/information`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe details." });
  }
}

// Fetch recipe ingredients by ID
export async function getRecipeIngredients(req, res) {
  const recipeId = req.params.id;

  try {
    const response = await apiClient.get(`/${recipeId}/ingredientWidget.json`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe ingredients:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe ingredients." });
  }
}

// Fetch recipe instructions by ID
export async function getRecipeInstructions(req, res) {
  const recipeId = req.params.id;

  try {
    const response = await apiClient.get(`/${recipeId}/analyzedInstructions`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe instructions:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe instructions." });
  }
}