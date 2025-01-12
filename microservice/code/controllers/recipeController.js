import axios from "axios";
import dotenv from 'dotenv';
import { getCache, setCache } from "../utils/cache.js";

dotenv.config({ path: 'variables.env' });

const RECIPE_API_URL = "https://api.spoonacular.com/recipes";
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;
const PRODUCT_SERVICE_URL = "http://products:3013";


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

    setCache(cacheKey, response.data, CACHE_TTL);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    res.status(500).json({ error: "Something went wrong while fetching the recipe details." });
  }
};



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

export async function getProductsForRecipe(req, res) {
  const recipeId = req.params.id;


  const descriptorsToRemove = ["diced", "chopped", "minced", "sliced", "whole", "ground", "shredded"];


  function cleanIngredientName(name) {
    const descriptorsToRemove = ["diced", "chopped", "minced", "sliced", "whole", "ground", "shredded", "toppings", "additional"];
    name = name
      .toLowerCase()
      .replace(/[^a-z\s]/g, "") 
      .split(" ")
      .filter(word => !descriptorsToRemove.includes(word) && word.trim().length > 0)
      .join(" ");
    return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  try {
    const recipeResponse = await apiClient.get(`/${recipeId}/ingredientWidget.json`);
    const ingredients = recipeResponse.data.ingredients.map((ingredient) => {
      const rawName = ingredient.nameClean || ingredient.name;
      return cleanIngredientName(rawName); 
    });

    const translationResponse = await axios.post('https://translation.googleapis.com/language/translate/v2', {
      q: ingredients,
      target: 'nl',
      format: 'text',
      key: process.env.GOOGLE_TRANSLATE_API_KEY
    });

    const translatedIngredients = translationResponse.data.data.translations.map(translation => translation.translatedText);
    console.log("Cleaned and Translated ingredients fetched:", translatedIngredients);

    const productResponse = await axios.post(`${PRODUCT_SERVICE_URL}/products/by-ingredients`, {
      translatedIngredients,
    });

    res.status(200).json(productResponse.data);
  } catch (error) {
    console.error("Error fetching products for recipe:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    res.status(500).json({ error: "Something went wrong while fetching products for the recipe." });
  }
}
