const express = require('express');
const passport = require('passport');
const userModel = require('../dao/models/userModel');
const { generateToken } = require('../utils/jwt');
const { createHash, isValidPassword } = require('../utils/passwordHash');

const sessionRouter = express.Router();

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {

})

sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
  return res.json(req.user)
})

sessionRouter.post('/register', async (req, res) => {
  try {
    const { name, apellido, email, password } = req.body;
    if (!name || !apellido || !email || !password) {
      console.log('req.body');
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      console.log('user');
      return res.status(401).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = createHash(password);

    const newUser = {
      name,
      apellido,
      email,
      password: hashedPassword,
      username: email,
      isAdmin: req.body.isAdmin || false,
    };

    const token = generateToken({
      name,
      email,
    });

    await userModel.create(newUser);

    return res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

sessionRouter.get('/failregister', (req, res) => {
  return res.json({
    error: 'Error al registrarse'
  });
});

sessionRouter.get('/faillogin', (req, res) => {
  return res.json({
    error: 'Error al iniciar sesión'
  });
});

sessionRouter.post('/login', 
  passport.authenticate('login', { failureRedirect: '/faillogin' }), 
  async (req, res) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });

      if (!user) {
        console.log({user});
        return res.status(401).json({
          error: 'El usuario no existe en el sistema'
        });
      }

      if (!isValidPassword(req.body.password, user.password)) {
        return res.status(401).json({
          error: 'Datos incorrectos'
        });
      }

      user = user.toObject();

      delete user.password;

      req.session.user = user;

      if (user.isAdmin) {
        return res.redirect('/products');
      } else {
        return res.redirect('/profile');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

sessionRouter.post('/recovery-password', async (req, res) => {

  let user = await userModel.findOne({ email: req.body.email })

  if (!user) {
    return res.status(401).json({
      error: 'El usuario no existe en el sistema'
    })
  }

  const newPassword = createHash(req.body.password)
  await userModel.updateOne({ email: user.email }, { password: newPassword })

  return res.redirect('/login')

})

module.exports = sessionRouter;

