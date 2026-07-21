function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?message=Please+log+in+first');
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page.'
        });
    }

    next();
}

module.exports = { requireAdmin };