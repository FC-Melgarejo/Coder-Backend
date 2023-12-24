const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const userModel = require('../dao/models/userModel');
const { isValidPassword } = require('../utils/passwordHash');

const initializeLocalLoginStrategy = () => {
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const existe = await userModel.findOne({ email: email }).populate('cart');

        if (!existe) {
          console.log('El usuario no existe en el sistema');
          return done(null, false, { message: 'El usuario no existe en el sistema' });
        }

        if (!isValidPassword(password, existe.password)) {
          return done(null, false, { message: 'Datos incorrectos' });
        }

        if (!existe.cart) {
          // Lógica para crear un carrito predeterminado si no existe
        }

        return done(null, existe);
      } catch (error) {
        return done(error);
      }
    }
  ));
};

module.exports = initializeLocalLoginStrategy;

