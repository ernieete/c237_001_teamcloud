const db = require("../config/db");

// Get all recipes
function getAllRecipes(callback) {
    const sql = `
        SELECT recipes.*, users.username
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        ORDER BY recipes.created_at DESC
    `;

    db.query(sql, callback);
}

// Add a new recipe
function addRecipe(recipe, callback) {

    const sql = `
        INSERT INTO recipes
        (
            user_id,
            title,
            description,
            ingredients,
            instructions,
            servings,
            category,
            difficulty,
            cooking_time,
            youtube_link
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        recipe.user_id,
        recipe.title,
        recipe.description,
        recipe.ingredients,
        recipe.instructions,
        recipe.servings,
        recipe.category,
        recipe.difficulty,
        recipe.cooking_time,
        recipe.youtube_link
    ], callback);
}

// Get a single recipe by ID
function getRecipeById(id, callback) {

    const sql = `
        SELECT recipes.*, users.username
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        WHERE recipes.id = ?
    `;

    db.query(sql, [id], callback);

}

module.exports = {
    getAllRecipes,
    addRecipe,
    getRecipeById
};