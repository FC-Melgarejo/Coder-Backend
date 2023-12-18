const passport = require('passport');

const passportCall = (strategy, view = false) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        if (view) {
          return res.redirect('login')
        }
        
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString()
        })
      }

      req.user = user

      return next()
    })(req, res, next)
  }
}

module.exports = { passportCall }