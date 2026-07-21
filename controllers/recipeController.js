const recipeModel = require("../models/recipeModel");

// Display all recipes
exports.showRecipes = (req, res) => {
    recipeModel.getAllRecipes((err, recipes) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipes.");
        }

        res.render("recipes/index", {
            title: "Recipe List",
            recipes,
            user: req.session.user
        });
    });
};

// Show Add Recipe page
exports.showAddRecipe = (req, res) => {
    res.render("recipes/addRecipe", {
        title: "Add Recipe"
    });
};

// Handle Add Recipe form submission
exports.addRecipe = (req, res) => {

    const recipe = {
        user_id: req.session.user.id,
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        servings: req.body.servings,
        category: req.body.category,
        difficulty: req.body.difficulty,
        cooking_time: req.body.cooking_time,
        youtube_link: req.body.youtube_link,
        image: req.file.filename
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

// Show Edit Recipe page
exports.showEditRecipe = (req, res) => {

    const recipeId = req.params.id;

    recipeModel.getRecipeForEdit(recipeId, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipe.");
        }

        if (results.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        const recipe = results[0];

        const isAdmin = req.session.user.role === "admin";
        const isOwner = recipe.user_id === req.session.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).send("Access denied.");
        }

        res.render("recipes/editRecipe", {
            title: "Edit Recipe",
            recipe
        });

    });

};

// Handle Edit Recipe form submission
exports.editRecipe = (req, res) => {

    const recipeId = req.params.id;

    recipeModel.getRecipeForEdit(recipeId, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipe.");
        }

        if (results.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        const existingRecipe = results[0];

        // Check if the user is allowed to edit
        const isAdmin = req.session.user.role === "admin";
        const isOwner = existingRecipe.user_id === req.session.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).send("Access denied.");
        }

        const recipe = {
            title: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            servings: req.body.servings,
            category: req.body.category,
            difficulty: req.body.difficulty,
            cooking_time: req.body.cooking_time,
            youtube_link: req.body.youtube_link,

            // Keep existing image if no new one is uploaded
            image: req.file ? req.file.filename : existingRecipe.image
        };

        recipeModel.updateRecipe(recipeId, recipe, (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Error updating recipe.");
            }

            res.redirect("/recipes");

        });

    });

};

// Delete Recipe
exports.deleteRecipe = (req, res) => {

    const recipeId = req.params.id;

    recipeModel.getRecipeForEdit(recipeId, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving recipe.");
        }

        if (results.length === 0) {
            return res.status(404).send("Recipe not found.");
        }

        const recipe = results[0];

        // Check if the user is allowed to delete
        const isAdmin = req.session.user.role === "admin";
        const isOwner = recipe.user_id === req.session.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).send("Access denied.");
        }

        recipeModel.deleteRecipe(recipeId, (err) => {

            if (err) {
                console.error(err);
                return res.status(500).send("Error deleting recipe.");
            }

            res.redirect("/recipes");

        });

    });

};