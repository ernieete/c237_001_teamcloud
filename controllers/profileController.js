const bcrypt = require('bcrypt');
const db = require('../config/db');

function getUser(userId, callback) {
    db.query(
        'SELECT id, username, email, address, contact, role, profile_image, created_at FROM users WHERE id = ?',
        [userId],
        (error, rows) => callback(error, rows[0])
    );
}

function viewProfile(req, res) {
    getUser(req.session.user.id, (error, user) => {
        if (error || !user) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Profile Error', message: 'Unable to load your profile.'
            });
        }
        res.render('profile/view', {
            title: 'My Profile', user, message: req.query.message || null
        });
    });
}

function showEditProfile(req, res) {
    getUser(req.session.user.id, (error, user) => {
        if (error || !user) {
            return res.status(500).render('error', {
                title: 'Profile Error', message: 'Unable to load your profile.'
            });
        }
        res.render('profile/edit', { title: 'Edit Profile', user, error: null });
    });
}

function updateProfile(req, res) {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const address = (req.body.address || '').trim();
    const contact = (req.body.contact || '').trim();
    const user = { ...req.session.user, username, email, address, contact };

    if (!username || !email) {
        return res.status(400).render('profile/edit', {
            title: 'Edit Profile', user, error: 'Username and email are required.'
        });
    }

    const sql = 'UPDATE users SET username = ?, email = ?, address = ?, contact = ? WHERE id = ?';
    db.query(sql, [username, email, address || null, contact || null, req.session.user.id], (error) => {
        if (error) {
            const message = error.code === 'ER_DUP_ENTRY'
                ? 'That username or email is already being used.'
                : 'Unable to update your profile.';
            return res.status(error.code === 'ER_DUP_ENTRY' ? 400 : 500).render('profile/edit', {
                title: 'Edit Profile', user, error: message
            });
        }

        req.session.user.username = username;
        req.session.user.email = email;
        res.redirect('/profile?message=Profile+updated+successfully');
    });
}

function updateProfileImage(req, res) {
    if (!req.file) {
        return res.redirect('/profile?message=Please+choose+an+image');
    }

    db.query('UPDATE users SET profile_image = ? WHERE id = ?', [req.file.filename, req.session.user.id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Upload Error', message: 'Unable to update your profile image.'
            });
        }
        req.session.user.profile_image = req.file.filename;
        res.redirect('/profile?message=Profile+image+updated');
    });
}

function showChangePassword(req, res) {
    res.render('profile/changePassword', {
        title: 'Change Password', error: null, message: null
    });
}

function changePassword(req, res) {
    const currentPassword = req.body.currentPassword || '';
    const newPassword = req.body.newPassword || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).render('profile/changePassword', {
            title: 'Change Password', error: 'Please complete all fields.', message: null
        });
    }
    if (newPassword.length < 8) {
        return res.status(400).render('profile/changePassword', {
            title: 'Change Password', error: 'New password must contain at least 8 characters.', message: null
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).render('profile/changePassword', {
            title: 'Change Password', error: 'The new passwords do not match.', message: null
        });
    }

    db.query('SELECT password FROM users WHERE id = ?', [req.session.user.id], async (error, rows) => {
        if (error || rows.length === 0) {
            return res.status(500).render('profile/changePassword', {
                title: 'Change Password', error: 'Unable to change your password.', message: null
            });
        }

        try {
            const correct = await bcrypt.compare(currentPassword, rows[0].password);
            if (!correct) {
                return res.status(400).render('profile/changePassword', {
                    title: 'Change Password', error: 'Current password is incorrect.', message: null
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.session.user.id], (updateError) => {
                if (updateError) {
                    return res.status(500).render('profile/changePassword', {
                        title: 'Change Password', error: 'Unable to change your password.', message: null
                    });
                }
                res.render('profile/changePassword', {
                    title: 'Change Password', error: null, message: 'Password changed successfully.'
                });
            });
        } catch (compareError) {
            console.error(compareError);
            res.status(500).render('profile/changePassword', {
                title: 'Change Password', error: 'Unable to change your password.', message: null
            });
        }
    });
}

function viewMyRecipes(req, res) {
    db.query('SELECT * FROM recipes WHERE user_id = ? ORDER BY created_at DESC', [req.session.user.id], (error, recipes) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Recipe Error', message: 'Unable to load your recipes.'
            });
        }
        res.render('profile/myRecipes', { title: 'My Recipes', recipes });
    });
}

function viewMyFavourites(req, res) {
    const sql = `
        SELECT recipes.*, favourites.created_at AS favourited_at
        FROM favourites
        JOIN recipes ON recipes.id = favourites.recipe_id
        WHERE favourites.user_id = ?
        ORDER BY favourites.created_at DESC
    `;
    db.query(sql, [req.session.user.id], (error, recipes) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Favourite Error', message: 'Unable to load your favourite recipes.'
            });
        }
        res.render('profile/myFavourites', { title: 'My Favourites', recipes });
    });
}

module.exports = {
    viewProfile,
    showEditProfile,
    updateProfile,
    updateProfileImage,
    showChangePassword,
    changePassword,
    viewMyRecipes,
    viewMyFavourites
};
