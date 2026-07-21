const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");
const { uploadRecipeImage } = require("../middleware/uploadMiddleware");

// Display all recipes
router.get("/", recipeController.showRecipes);

// Show Add Recipe page
router.get("/add", recipeController.showAddRecipe);

// Handle Add Recipe form
router.post(
    "/add",
    uploadRecipeImage.single("image"),
    recipeController.addRecipe
);

// Show Edit Recipe page
router.get(
    "/edit/:id",
    recipeController.showEditRecipe
);

// Handle Edit Recipe
router.post(
    "/edit/:id",
    uploadRecipeImage.single("image"),
    recipeController.editRecipe
);

// Delete Recipe
router.post(
    "/delete/:id",
    recipeController.deleteRecipe
);

// Display a single recipe
router.get("/:id", recipeController.showRecipeDetails);

module.exports = router;