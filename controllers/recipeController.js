const recipeModel = require("../models/recipeModel");

// Display all recipes
exports.showRecipes = (req, res) => {
    recipeModel.getAllRecipes((err, recipes) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipes.");
        }

        res.render("recipes/index", {
            recipes
        });
    });
};

// Show Add Recipe page
exports.showAddRecipe = (req, res) => {
    res.render("recipes/addRecipe");
};