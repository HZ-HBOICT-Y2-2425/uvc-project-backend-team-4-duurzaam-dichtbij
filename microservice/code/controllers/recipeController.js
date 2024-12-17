import axios from "axios";
import dotenv from 'dotenv';
import { getCache, setCache } from "../utils/cache.js";

dotenv.config({ path: 'variables.env' });

const RECIPE_API_URL = "https://api.spoonacular.com/recipes";
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;

const apiClient = axios.create({
  baseURL: RECIPE_API_URL,
  params: {
    apiKey: RECIPE_API_KEY
  }
});

const CACHE_TTL = 24 * 60 * 60 * 1000;

const getRecipes = async (req, res) => {
  const query = req.query.query || '';
  const number = req.query.number || 10;

  const cacheKey = `recipes_${query}_${number}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    console.log("Serving from cache");
    return res.status(200).json(cachedData);
  }

  try {
    const response = await apiClient.get('/complexSearch', {
      params: { query, number }
    });

    const recipes = response.data;

    // Zet het antwoord in de cache
    setCache(cacheKey, recipes, CACHE_TTL);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching recipes." });
  }
};

const getRecipeById = async (req, res) => {
  const recipeId = req.params.id;
  const cacheKey = `recipe_${recipeId}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    console.log("Serving from cache");
    return res.status(200).json(cachedData);
  }

  try {
    const response = await apiClient.get(`/${recipeId}/information`);

    // Zet het antwoord in de cache
    setCache(cacheKey, response.data, CACHE_TTL);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe details." });
  }
};


// Fetch recipe ingredients by ID
async function getRecipeIngredients(req, res) {
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
async function getRecipeInstructions(req, res) {
  const recipeId = req.params.id;

  try {
    const response = await apiClient.get(`/${recipeId}/analyzedInstructions`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe instructions:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe instructions." });
  }
}

export { getRecipes, getRecipeById, getRecipeIngredients, getRecipeInstructions };
