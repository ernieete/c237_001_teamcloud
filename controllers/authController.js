const bcrypt = require('bcrypt');
const db = require('../config/db');

function showLogin(req, res) {
    res.render('auth/login', {
        title: 'Login',
        error: null,
        message: req.query.message || null,
        formData: {}
    });
}

function showRegister(req, res) {
    res.render('auth/register', {
        title: 'Register',
        error: null,
        formData: {}
    });
}

async function register(req, res) {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';
    const formData = { username, email };

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).render('auth/register', {
            title: 'Register', error: 'Please complete all required fields.', formData
        });
    }

    if (password.length < 8) {
        return res.status(400).render('auth/register', {
            title: 'Register', error: 'Password must contain at least 8 characters.', formData
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).render('auth/register', {
            title: 'Register', error: 'The passwords do not match.', formData
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')`;

        db.query(sql, [username, email, hashedPassword], (error) => {
            if (error) {
                const duplicate = error.code === 'ER_DUP_ENTRY';
                return res.status(duplicate ? 400 : 500).render('auth/register', {
                    title: 'Register',
                    error: duplicate ? 'That username or email is already registered.' : 'Unable to create the account. Please try again.',
                    formData
                });
            }
            res.redirect('/login?message=Account+created+successfully');
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('auth/register', {
            title: 'Register', error: 'Unable to create the account. Please try again.', formData
        });
    }
}

function login(req, res) {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const formData = { email };

    if (!email || !password) {
        return res.status(400).render('auth/login', {
            title: 'Login', error: 'Please enter your email and password.', message: null, formData
        });
    }

    db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], async (error, rows) => {
        if (error) {
            console.error(error);
            return res.status(500).render('auth/login', {
                title: 'Login', error: 'Unable to log in. Please try again.', message: null, formData
            });
        }

        if (rows.length === 0) {
            return res.status(401).render('auth/login', {
                title: 'Login', error: 'Invalid email or password.', message: null, formData
            });
        }

        try {
            const user = rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).render('auth/login', {
                    title: 'Login', error: 'Invalid email or password.', message: null, formData
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image
            };

            res.redirect(user.role === 'admin' ? '/admin/users' : '/profile');
        } catch (compareError) {
            console.error(compareError);
            res.status(500).render('auth/login', {
                title: 'Login', error: 'Unable to log in. Please try again.', message: null, formData
            });
        }
    });
}

function logout(req, res) {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).render('error', {
                title: 'Logout Error', message: 'Unable to log out. Please try again.'
            });
        }
        res.clearCookie('connect.sid');
        res.redirect('/login?message=You+have+logged+out');
    });
}

module.exports = { showLogin, showRegister, register, login, logout };
