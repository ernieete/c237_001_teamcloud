// Member 3: Favourite recipe functions will be added here.
const db = require('../config/db');
const { promisify } = require('util');

const query = promisify(db.query).bind(db);

/**
 * Add recipe to favourites
 * POST /favourite/add/:id
 */
exports.addFavourite = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const recipeId = req.params.id;

        const existing = await query(
            `SELECT id
             FROM favourites
             WHERE user_id = ?
             AND recipe_id = ?`,
            [userId, recipeId]
        );

        if (existing.length > 0) {
            return res.redirect('back');
        }

        await query(
            `INSERT INTO favourites (user_id, recipe_id)
             VALUES (?, ?)`,
            [userId, recipeId]
        );

        res.redirect('back');

    } catch (err) {
        console.error(err);
        res.status(500).send("Unable to add favourite.");
    }
};


/**
 * Remove favourite
 * POST /favourite/remove/:id
 */
exports.removeFavourite = async (req, res) => {

    try {

        const userId = req.session.user.id;
        const recipeId = req.params.id;

        await query(
            `DELETE FROM favourites
             WHERE user_id=?
             AND recipe_id=?`,
            [userId, recipeId]
        );

        res.redirect('back');

    } catch (err) {

        console.error(err);
        res.status(500).send("Unable to remove favourite.");

    }

};


/**
 * GET /favourites
 */
exports.viewFavourites = async (req, res) => {

    try {

        const userId = req.session.user.id;

        const favourites = await query(
            `
            SELECT
                recipes.*,
                favourites.created_at
            FROM favourites

            INNER JOIN recipes
                ON recipes.id = favourites.recipe_id

            WHERE favourites.user_id = ?

            ORDER BY favourites.created_at DESC
            `,
            [userId]
        );

        const stats = await exports.getStatisticsData(userId);

        res.render('profile/myFavourites', {

            title: "My Favourites",
            favourites,
            stats,
            user: req.session.user

        });

    } catch (err) {

        console.error(err);
        res.status(500).send("Unable to load favourites.");

    }

};


/**
 * AJAX
 */
exports.getFavouriteCount = async (req, res) => {

    try {

        const userId = req.session.user.id;

        const result = await query(
            `
            SELECT COUNT(*) AS total
            FROM favourites
            WHERE user_id=?
            `,
            [userId]
        );

        res.json(result[0]);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: true });

    }

};


/**
 * Check if recipe already saved
 */
exports.isFavourite = async (userId, recipeId) => {

    const result = await query(

        `
        SELECT id
        FROM favourites
        WHERE user_id=?
        AND recipe_id=?
        `,
        [userId, recipeId]

    );

    return result.length > 0;

};


/**
 * Statistics helper
 */
exports.getStatisticsData = async (userId) => {

    const totalResult = await query(

        `
        SELECT COUNT(*) AS total
        FROM favourites
        WHERE user_id=?
        `,
        [userId]

    );

    const latestResult = await query(

        `
        SELECT recipes.title

        FROM favourites

        INNER JOIN recipes
            ON recipes.id=favourites.recipe_id

        WHERE favourites.user_id=?

        ORDER BY favourites.created_at DESC

        LIMIT 1
        `,
        [userId]

    );

    const categoryResult = await query(

        `
        SELECT
            recipes.category,
            COUNT(*) AS total

        FROM favourites

        INNER JOIN recipes
            ON recipes.id=favourites.recipe_id

        WHERE favourites.user_id=?

        GROUP BY recipes.category

        ORDER BY total DESC

        LIMIT 1
        `,
        [userId]

    );

    return {

        total: totalResult[0].total,

        latest:
            latestResult.length > 0
                ? latestResult[0].title
                : "None",

        topCategory:
            categoryResult.length > 0
                ? categoryResult[0].category
                : "None"

    };

};