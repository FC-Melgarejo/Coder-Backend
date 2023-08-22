const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel'); // Reemplaza con la ruta correcta a tu modelo de usuario

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});

// Estrategia de autenticación local (inicio de sesión)
passport.use(new LocalStrategy({
    usernameField: 'email', // Reemplaza con el campo correcto para el correo electrónico
    passwordField: 'password', // Reemplaza con el campo correcto para la contraseña
}, (email, password, done) => {
    userModel.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        return done(null, user);
    });
}));
