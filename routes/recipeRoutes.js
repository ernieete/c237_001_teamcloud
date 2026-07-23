const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipeController");
const { uploadRecipeImage } = require("../middleware/uploadMiddleware");
const { requireLogin } = require("../middleware/authMiddleware");

// Public: display all recipes
router.get("/", recipeController.showRecipes);

// Logged-in users only: show Add Recipe page
router.get(
    "/add",
    requireLogin,
    recipeController.showAddRecipe
);

// Logged-in users only: handle Add Recipe form
router.post(
    "/add",
    requireLogin,
    uploadRecipeImage.single("image"),
    recipeController.addRecipe
);

// Logged-in users only: show Edit Recipe page
router.get(
    "/edit/:id",
    requireLogin,
    recipeController.showEditRecipe
);

// Logged-in users only: handle Edit Recipe
router.post(
    "/edit/:id",
    requireLogin,
    uploadRecipeImage.single("image"),
    recipeController.editRecipe
);

// Logged-in users only: delete recipe
router.post(
    "/delete/:id",
    requireLogin,
    recipeController.deleteRecipe
);

// Public: display a single recipe
// Keep this route last.
router.get("/:id", recipeController.showRecipeDetails);

module.exports = router;