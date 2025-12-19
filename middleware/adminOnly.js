// middleware/adminOnly.js
module.exports = function adminOnly(req, res, next) {
    if (req.session && req.session.user && req.session.user.email === 'admin@shop.com') {
        return next();
    }
    req.flash && req.flash('error', 'Admins only!');
    res.redirect('/');
};
