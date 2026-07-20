const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");

// Display all recipes
router.get("/", recipeController.showRecipes);

router.get("/add", recipeController.showAddRecipe);

module.exports = router;