const db = require("../config/db");

// Add a new rating
function addRating(userId, recipeId, rating, callback) {
    const sql = `
        INSERT INTO ratings (user_id, recipe_id, rating)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, recipeId, rating], callback);
}

// Get user's rating for a recipe
function getUserRating(userId, recipeId, callback) {
    const sql = `
        SELECT *
        FROM ratings
        WHERE user_id = ? AND recipe_id = ?
    `;

    db.query(sql, [userId, recipeId], callback);
}

// Update user's own rating
function updateRating(userId, recipeId, rating, callback) {
    const sql = `
        UPDATE ratings
        SET rating = ?
        WHERE user_id = ? AND recipe_id = ?
    `;

    db.query(sql, [rating, userId, recipeId], callback);
}

// Delete user's own rating
function deleteRating(userId, recipeId, callback) {
    const sql = `
        DELETE FROM ratings
        WHERE user_id = ? AND recipe_id = ?
    `;

    db.query(sql, [userId, recipeId], callback);
}

// Get average rating and total ratings
function getAverageRating(recipeId, callback) {
    const sql = `
        SELECT
            ROUND(AVG(rating), 1) AS averageRating,
            COUNT(*) AS totalRatings
        FROM ratings
        WHERE recipe_id = ?
    `;

    db.query(sql, [recipeId], callback);
}

// Get rating breakdown
function getRatingBreakdown(recipeId, callback) {
    const sql = `
        SELECT
            rating,
            COUNT(*) AS total
        FROM ratings
        WHERE recipe_id = ?
        GROUP BY rating
        ORDER BY rating DESC
    `;

    db.query(sql, [recipeId], callback);
}

// Get highest rated recipes
function getHighestRatedRecipes(callback) {
    const sql = `
        SELECT
            recipes.id,
            recipes.title,
            recipes.image,
            ROUND(AVG(ratings.rating), 1) AS averageRating,
            COUNT(ratings.id) AS totalRatings
        FROM recipes
        JOIN ratings
            ON recipes.id = ratings.recipe_id
        GROUP BY recipes.id
        ORDER BY averageRating DESC, totalRatings DESC
        LIMIT 5
    `;

    db.query(sql, callback);
}

module.exports = {
    addRating,
    getUserRating,
    updateRating,
    deleteRating,
    getAverageRating,
    getRatingBreakdown,
    getHighestRatedRecipes
};