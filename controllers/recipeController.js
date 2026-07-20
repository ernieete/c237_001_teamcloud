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

// Handle Add Recipe form submission
exports.addRecipe = (req, res) => {

    const recipe = {
        user_id: 11, // Temporary until login/session is implemented
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        servings: req.body.servings,
        category: req.body.category,
        difficulty: req.body.difficulty,
        cooking_time: req.body.cooking_time,
        youtube_link: req.body.youtube_link
    };

    recipeModel.addRecipe(recipe, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error adding recipe.");
        }

        res.redirect("/recipes");
    });

};

// Display a single recipe
exports.showRecipeDetails = (req, res) => {

    const recipeId = req.params.id;

    recipeModel.getRecipeById(recipeId, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipe.");
        }

        if (results.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        res.render("recipes/viewRecipe", {
            recipe: results[0]
        });

    });

};