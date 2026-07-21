function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?message=Please+log+in+first');
    }
    next();
}

function requireGuest(req, res, next) {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    next();
}

module.exports = { requireLogin, requireGuest };
