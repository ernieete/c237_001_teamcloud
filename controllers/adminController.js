const db = require('../config/db');
const adminModel = require('../models/adminModel');

// ============================================================
//  USER MANAGEMENT
// ============================================================
function listUsers(req, res) {
    const search = (req.query.search || '').trim();
    const pattern = `%${search}%`;
    const sql = search
        ? 'SELECT id, username, email, role, profile_image, created_at FROM users WHERE username LIKE ? OR email LIKE ? ORDER BY created_at DESC'
        : 'SELECT id, username, email, role, profile_image, created_at FROM users ORDER BY created_at DESC';
    const params = search ? [pattern, pattern] : [];

    db.query(sql, params, (error, users) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Admin Error', message: 'Unable to load users.'
            });
        }
        res.render('admin/users', {
            title: 'Manage Users', users, search, message: req.query.message || null
        });
    });
}

function viewUser(req, res) {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
        return res.status(400).render('error', { title: 'Invalid User', message: 'Invalid user ID.' });
    }

    const sql = `
        SELECT u.id, u.username, u.email, u.address, u.contact, u.role,
               u.profile_image, u.created_at,
               COUNT(DISTINCT r.id) AS recipe_count,
               COUNT(DISTINCT f.id) AS favourite_count
        FROM users u
        LEFT JOIN recipes r ON r.user_id = u.id
        LEFT JOIN favourites f ON f.user_id = u.id
        WHERE u.id = ?
        GROUP BY u.id
    `;
    db.query(sql, [userId], (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Admin Error', message: 'Unable to load user details.'
            });
        }
        if (rows.length === 0) {
            return res.status(404).render('404', { title: 'User Not Found' });
        }
        res.render('admin/userDetails', { title: 'User Details', user: rows[0] });
    });
}

function deleteUser(req, res) {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) {
        return res.status(400).render('error', { title: 'Invalid User', message: 'Invalid user ID.' });
    }
    if (userId === req.session.user.id) {
        return res.redirect('/admin/users?message=You+cannot+delete+your+own+admin+account');
    }

    db.query('DELETE FROM users WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Delete Error', message: 'Unable to delete this user.'
            });
        }
        const message = result.affectedRows ? 'User+deleted+successfully' : 'User+was+not+found';
        res.redirect(`/admin/users?message=${message}`);
    });
}

// ============================================================
//  DASHBOARD + ANALYTICS
// ============================================================
function showDashboard(req, res) {
    const data = {};
    let remaining = 6;
    let failed = false;

    function done(err) {
        if (failed) return;
        if (err) {
            failed = true;
            console.error(err);
            return res.status(500).render('error', {
                title: 'Admin Error', message: 'Unable to load dashboard.'
            });
        }
        remaining--;
        if (remaining === 0) {
            res.render('admin/dashboard', {
                title: 'Admin Dashboard',
                user: req.session.user,
                currentUser: req.session.user,
                totals: data.totals,
                mostPopular: data.mostPopular,
                highestRated: data.highestRated,
                mostActiveUser: data.mostActiveUser,
                mostUsedCategory: data.mostUsedCategory,
                featured: data.featured
            });
        }
    }

    adminModel.getTotals((err, rows) => { if (!err) data.totals = rows[0]; done(err); });
    adminModel.getMostPopularRecipe((err, rows) => { if (!err) data.mostPopular = rows[0] || null; done(err); });
    adminModel.getHighestRatedRecipe((err, rows) => { if (!err) data.highestRated = rows[0] || null; done(err); });
    adminModel.getMostActiveUser((err, rows) => { if (!err) data.mostActiveUser = rows[0] || null; done(err); });
    adminModel.getMostUsedCategory((err, rows) => { if (!err) data.mostUsedCategory = rows[0] || null; done(err); });
    adminModel.getFeaturedRecipes((err, rows) => { if (!err) data.featured = rows; done(err); });
}

// ============================================================
//  RECIPE MANAGEMENT
// ============================================================
function showAdminRecipes(req, res) {
    adminModel.getAllRecipesForAdmin((error, recipes) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Admin Error', message: 'Unable to load recipes.'
            });
        }
        res.render('admin/recipes', {
            title: 'Manage Recipes',
            user: req.session.user,
            currentUser: req.session.user,
            recipes
        });
    });
}

function featureRecipe(req, res) {
    adminModel.featureRecipe(req.params.id, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', { title: 'Admin Error', message: 'Unable to feature recipe.' });
        }
        res.redirect('/admin/recipes');
    });
}

function unfeatureRecipe(req, res) {
    adminModel.unfeatureRecipe(req.params.id, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', { title: 'Admin Error', message: 'Unable to unfeature recipe.' });
        }
        res.redirect('/admin/recipes');
    });
}

function deleteRecipe(req, res) {
    adminModel.deleteRecipe(req.params.id, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', { title: 'Admin Error', message: 'Unable to delete recipe.' });
        }
        res.redirect('/admin/recipes');
    });
}

module.exports = {
    listUsers,
    viewUser,
    deleteUser,
    showDashboard,
    showAdminRecipes,
    featureRecipe,
    unfeatureRecipe,
    deleteRecipe
};