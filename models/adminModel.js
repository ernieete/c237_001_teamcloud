const db = require("../config/db");

// ============================================================
//  DASHBOARD TOTALS
// ============================================================
function getTotals(callback) {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM users)    AS totalUsers,
            (SELECT COUNT(*) FROM recipes)  AS totalRecipes,
            (SELECT COUNT(*) FROM comments) AS totalComments,
            (SELECT COUNT(*) FROM ratings)  AS totalRatings
    `;
    db.query(sql, callback);
}

// ============================================================
//  ANALYTICS
// ============================================================
function getMostPopularRecipe(callback) {
    const sql = `
        SELECT
            recipes.*,
            users.username,
            COUNT(favourites.id) AS favourite_count
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        LEFT JOIN favourites
            ON favourites.recipe_id = recipes.id
        GROUP BY recipes.id, users.username
        ORDER BY favourite_count DESC, recipes.created_at DESC
        LIMIT 1
    `;
    db.query(sql, callback);
}

function getHighestRatedRecipe(callback) {
    const sql = `
        SELECT
            recipes.*,
            users.username,
            AVG(ratings.rating) AS average_rating,
            COUNT(ratings.id)   AS rating_count
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        JOIN ratings
            ON ratings.recipe_id = recipes.id
        GROUP BY recipes.id, users.username
        ORDER BY average_rating DESC, rating_count DESC
        LIMIT 1
    `;
    db.query(sql, callback);
}

function getMostActiveUser(callback) {
    const sql = `
        SELECT
            users.id,
            users.username,
            users.profile_image,
            COUNT(recipes.id) AS recipe_count
        FROM users
        LEFT JOIN recipes
            ON recipes.user_id = users.id
        GROUP BY users.id, users.username, users.profile_image
        ORDER BY recipe_count DESC
        LIMIT 1
    `;
    db.query(sql, callback);
}

function getMostUsedCategory(callback) {
    const sql = `
        SELECT
            category,
            COUNT(*) AS category_count
        FROM recipes
        GROUP BY category
        ORDER BY category_count DESC
        LIMIT 1
    `;
    db.query(sql, callback);
}

// ============================================================
//  FEATURED / HOMEPAGE HELPERS
// ============================================================
function getFeaturedRecipes(callback) {
    const sql = `
        SELECT recipes.*, users.username
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        WHERE recipes.featured = TRUE
        ORDER BY recipes.created_at DESC
    `;
    db.query(sql, callback);
}

// ============================================================
//  ADMIN RECIPE MANAGEMENT
// ============================================================
function getAllRecipesForAdmin(callback) {
    const sql = `
        SELECT
            recipes.*,
            users.username,
            (SELECT COUNT(*) FROM favourites WHERE favourites.recipe_id = recipes.id) AS favourite_count,
            (SELECT COUNT(*) FROM ratings    WHERE ratings.recipe_id    = recipes.id) AS rating_count
        FROM recipes
        JOIN users
            ON recipes.user_id = users.id
        ORDER BY recipes.created_at DESC
    `;
    db.query(sql, callback);
}

function featureRecipe(id, callback) {
    db.query("UPDATE recipes SET featured = TRUE WHERE id = ?", [id], callback);
}

function unfeatureRecipe(id, callback) {
    db.query("UPDATE recipes SET featured = FALSE WHERE id = ?", [id], callback);
}

function deleteRecipe(id, callback) {
    db.query("DELETE FROM recipes WHERE id = ?", [id], callback);
}

module.exports = {
    getTotals,
    getMostPopularRecipe,
    getHighestRatedRecipe,
    getMostActiveUser,
    getMostUsedCategory,
    getFeaturedRecipes,
    getAllRecipesForAdmin,
    featureRecipe,
    unfeatureRecipe,
    deleteRecipe
};