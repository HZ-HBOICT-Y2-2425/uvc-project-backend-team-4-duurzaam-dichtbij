import axios from "axios";

async function testGetProductsForRecipe() {
  const recipeId = 715415; // Gebruik een bestaand recept-ID dat ingrediënten bevat die overeenkomen met producten in je db.json

  try {
    console.log(`Testing API with recipe ID: ${recipeId}`);
    
    // Maak de API-aanroep
    const response = await axios.get(`http://localhost:3011/recipes/${recipeId}/products`);
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    // Controleer of er producten in de response zitten
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.error("Test failed: No products returned in response.");
      return;
    }
  } catch (error) {
    // Log details als de API-aanroep mislukt
    if (error.response) {
      console.error("Test failed: API returned error response.");
      console.error("Status code:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else {
      console.error("Test failed: Network or other error.");
      console.error("Error message:", error.message);
    }
  }
}

// Voer de test uit
testGetProductsForRecipe();
