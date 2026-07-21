const db = require('../config/db');

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

module.exports = { listUsers, viewUser, deleteUser };
