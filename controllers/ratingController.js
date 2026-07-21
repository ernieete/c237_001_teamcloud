const ratingModel = require("../models/ratingModel");

// Add rating
exports.addRating = (req, res) => {
    const userId = req.session.user.id;
    const recipeId = req.body.recipeId;
    const rating = parseInt(req.body.rating);

    if (!recipeId || !rating || rating < 1 || rating > 5) {
        return res.status(400).send("Invalid rating.");
    }

    // Check if user already rated this recipe
    ratingModel.getUserRating(userId, recipeId, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database Error");
        }

        // Prevent duplicate rating
        if (results.length > 0) {
            return res.redirect(`/recipes/${recipeId}`);
        }

        ratingModel.addRating(
            userId,
            recipeId,
            rating,
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Database Error");
                }

                res.redirect(`/recipes/${recipeId}`);
            }
        );
    });
};

// Update own rating
exports.updateRating = (req, res) => {
    const userId = req.session.user.id;
    const recipeId = req.body.recipeId;
    const rating = parseInt(req.body.rating);

    if (!recipeId || !rating || rating < 1 || rating > 5) {
        return res.status(400).send("Invalid rating.");
    }

    ratingModel.updateRating(
        userId,
        recipeId,
        rating,
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            res.redirect(`/recipes/${recipeId}`);
        }
    );
};

// Delete own rating
exports.deleteRating = (req, res) => {
    const userId = req.session.user.id;
    const recipeId = req.body.recipeId;

    ratingModel.deleteRating(
        userId,
        recipeId,
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            res.redirect(`/recipes/${recipeId}`);
        }
    );
};

// Highest rated recipes
exports.showHighestRated = (req, res) => {
    ratingModel.getHighestRatedRecipes(
        (err, recipes) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database Error");
            }

            res.render("community/highestRated", {
                title: "Highest Rated Recipes",
                recipes
            });
        }
    );
};