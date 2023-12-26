const express = require('express');
const { Router } = require('express');
const passport = require('passport');
const SessionsController = require('../controllers/sessionController');

const router = Router();
const sessionsController = new SessionsController();

router.post('/register', wrapAsync(sessionsController.register));
router.post('/login', wrapAsync(sessionsController.login));
router.get('/current', wrapAsync(sessionsController), wrapAsync(sessionsController.current));
router.get('/unprotectedLogin', wrapAsync(sessionsController), wrapAsync(sessionsController.unprotectedLogin));
router.get('/unprotectedCurrent', wrapAsync(sessionsController), wrapAsync(sessionsController.unprotectedCurrent));

const authRouter = express.Router();

authRouter.get('/github', passport.authenticate('github'));
authRouter.get('/github-callback', passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/login',
}));

module.exports = {
    router: router,
    authRouter: authRouter
};

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}



