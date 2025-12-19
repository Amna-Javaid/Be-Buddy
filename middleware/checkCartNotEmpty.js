// middleware/checkCartNotEmpty.js
module.exports = function checkCartNotEmpty(req, res, next) {
    if (!req.session || !req.session.cart || req.session.cart.length === 0) {
        req.flash && req.flash('error', 'Your cart is empty!');
        return res.redirect('/cart');
    }
    next();
};
