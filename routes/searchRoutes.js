const express = require("express");
const { promisify } = require("util");
const db = require("../config/db");

const router = express.Router();

// db.js exports a callback-style mysql2 connection, not mysql2/promise,
// so we wrap .query in promisify to use it with async/await here.
const query = promisify(db.query).bind(db);

// Shared SELECT that computes average rating and favourites count via joins.
const BASE_SELECT = `
  SELECT
    recipes.*,
    COALESCE(AVG(ratings.rating), 0) AS avg_rating,
    COUNT(DISTINCT favourites.id) AS favourites_count
  FROM recipes
  LEFT JOIN ratings ON ratings.recipe_id = recipes.id
  LEFT JOIN favourites ON favourites.recipe_id = recipes.id
`;

// ---------- SEARCH (by title or ingredient) ----------
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    let results = [];

    if (q) {
      results = await query(
        `${BASE_SELECT}
         WHERE recipes.title LIKE ? OR recipes.ingredients LIKE ?
         GROUP BY recipes.id
         ORDER BY recipes.title ASC`,
        [`%${q}%`, `%${q}%`]
      );
    }

    res.render('search', { title: 'Search Recipes', results, query: q });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching recipes');
  }
});

// ---------- FILTER + SORT ----------
router.get('/filter', async (req, res) => {
  try {
    const { category, difficulty, cookTime, minRating, sort } = req.query;

    let sql = `${BASE_SELECT} WHERE 1=1`;
    const params = [];

    if (category) {
      sql += ' AND recipes.category = ?';
      params.push(category);
    }
    if (difficulty) {
      sql += ' AND recipes.difficulty = ?';
      params.push(difficulty);
    }
    if (cookTime) {
      sql += ' AND recipes.cooking_time <= ?';
      params.push(Number(cookTime));
    }

    sql += ' GROUP BY recipes.id';

    if (minRating) {
      sql += ' HAVING avg_rating >= ?';
      params.push(Number(minRating));
    }

    const sortMap = {
      newest: 'recipes.created_at DESC',
      oldest: 'recipes.created_at ASC',
      most_favourited: 'favourites_count DESC',
      alphabetical: 'recipes.title ASC'
    };
    sql += ` ORDER BY ${sortMap[sort] || 'recipes.created_at DESC'}`;

    const results = await query(sql, params);

    res.render('filter', {
  title: 'Filtered Recipes',
  results,
  filters: { category, difficulty, cookTime, minRating, sort }
}); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error filtering recipes');
  }
});

module.exports = router;