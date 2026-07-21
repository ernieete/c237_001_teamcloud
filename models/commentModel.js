const db = require("../config/db");

// Add a comment
function addComment(userId, recipeId, comment, callback) {
    const sql = `
        INSERT INTO comments (user_id, recipe_id, comment)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, recipeId, comment], callback);
}

// Get all comments for a recipe
function getCommentsByRecipe(recipeId, callback) {
    const sql = `
        SELECT
            comments.id,
            comments.user_id,
            comments.recipe_id,
            comments.comment,
            comments.created_at,
            comments.updated_at,
            users.username
        FROM comments
        JOIN users
            ON comments.user_id = users.id
        WHERE comments.recipe_id = ?
        ORDER BY comments.created_at DESC
    `;

    db.query(sql, [recipeId], callback);
}

// Get one comment
function getCommentById(commentId, callback) {
    const sql = `
        SELECT *
        FROM comments
        WHERE id = ?
    `;

    db.query(sql, [commentId], callback);
}

// Update a comment
function updateComment(commentId, comment, callback) {
    const sql = `
        UPDATE comments
        SET comment = ?
        WHERE id = ?
    `;

    db.query(sql, [comment, commentId], callback);
}

// Delete a comment
function deleteComment(commentId, callback) {
    const sql = `
        DELETE FROM comments
        WHERE id = ?
    `;

    db.query(sql, [commentId], callback);
}

// Get most discussed recipes
function getMostDiscussedRecipes(callback) {
    const sql = `
        SELECT
            recipes.id,
            recipes.title,
            recipes.image,
            COUNT(comments.id) AS totalComments
        FROM recipes
        INNER JOIN comments
            ON recipes.id = comments.recipe_id
        GROUP BY
            recipes.id,
            recipes.title,
            recipes.image
        HAVING COUNT(comments.id) > 0
        ORDER BY totalComments DESC
        LIMIT 5
    `;

    db.query(sql, callback);
}

module.exports = {
    addComment,
    getCommentsByRecipe,
    getCommentById,
    updateComment,
    deleteComment,
    getMostDiscussedRecipes
};