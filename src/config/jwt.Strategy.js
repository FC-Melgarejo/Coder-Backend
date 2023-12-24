const passport = require('passport');
const passportJWT = require('passport-jwt');
const userModel = require('../dao/models/userModel');

const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const cookieExtractor = (req) => {
  return req.cookies && req.cookies.authToken;
};

const initializeJWTStrategy = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está definido en el archivo .env');
  }

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret
  }, (jwtPayload, done) => {
    return done(null, jwtPayload.user);
  }));
};

const passportCall = (strategy, view = false) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        if (view) {
          return res.redirect('login');
        }

        return res.status(401).json({
          error: info.messages ? info.messages : info.toString()
        });
      }

      req.user = user;

      return next();
    })(req, res, next);
  };
};

module.exports = {
  initializeJWTStrategy,
  passportCall
  // Otras exportaciones si las hay
};

