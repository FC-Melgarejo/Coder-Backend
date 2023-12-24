// middleware/sessionMiddleware.js
function sessionMiddleware(req, res, next) {
    if (req.session.user) {
        console.log('req.session.user');
        return res.redirect('/login');
    }
    return next();
}

module.exports = sessionMiddleware;
