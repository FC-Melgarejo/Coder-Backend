const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const userModel = require('../dao/models/userModel');

const initializeGitHubStrategy = () => {
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userModel.findOne({ email: profile._json.email });

      if (user) {
        console.log('Usuario ya existe');
        return done(null, user);
      }

      const newUser = await userModel.create({
        username: profile._json.login,
        email: profile._json.email
      });

      return done(null, newUser);
    } catch (e) {
      return done(e);
    }
  }));
};

module.exports = initializeGitHubStrategy;
