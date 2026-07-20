const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");
const upload = require("../middleware/uploadMiddleware");

// Display all recipes
router.get("/", recipeController.showRecipes);

// Show Add Recipe page
router.get("/add", recipeController.showAddRecipe);

// Handle Add Recipe form
router.post(
    "/add",
    upload.single("image"),
    recipeController.addRecipe
);

// Display a single recipe
router.get("/:id", recipeController.showRecipeDetails);

module.exports = router;