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
            youtube_link,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        recipe.youtube_link,
        recipe.image
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

// Get recipe for editing
function getRecipeForEdit(id, callback) {

    const sql = `
        SELECT *
        FROM recipes
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

}

// Update recipe
function updateRecipe(id, recipe, callback) {

    const sql = `
        UPDATE recipes
        SET
            title = ?,
            description = ?,
            ingredients = ?,
            instructions = ?,
            servings = ?,
            category = ?,
            difficulty = ?,
            cooking_time = ?,
            youtube_link = ?,
            image = ?
        WHERE id = ?
    `;

    db.query(sql, [
        recipe.title,
        recipe.description,
        recipe.ingredients,
        recipe.instructions,
        recipe.servings,
        recipe.category,
        recipe.difficulty,
        recipe.cooking_time,
        recipe.youtube_link,
        recipe.image,
        id
    ], callback);

}

// Delete recipe
function deleteRecipe(id, callback) {

    const sql = `
        DELETE FROM recipes
        WHERE id = ?
    `;

    db.query(sql, [id], callback);

}

module.exports = {
    getAllRecipes,
    addRecipe,
    getRecipeById,
    getRecipeForEdit,
    updateRecipe,
    deleteRecipe
};