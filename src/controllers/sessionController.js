const passport = require('passport');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const { createHash, passwordValidation } = require('../utils/passwordHash');
const jwt = require('jsonwebtoken');
const UserDTO = require('../DTO/userDTO');
const UserService = require('../services/userService');

const userService = new UserService();

class SessionsController {
  async register(req, res) {
    try {
      const { first_name, last_name, email, password, isAdmin } = req.body;
      if (!first_name || !last_name || !email || !password || isAdmin === undefined) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
      }

      const exists = await userService.getUserByEmail(email);
      if (exists) {
        return res.status(409).send({ status: 'error', error: 'User already exists' });
      }

      const hashedPassword = await createHash(password);
      const user = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        isAdmin,
        role: 'Buyer', 
        username: email,
        
      };

      const result = await userService.createUser(user);
      res.redirect('/login');

      // En una API, podrías devolver información sobre el usuario creado
      res.status(201).send({ status: 'success', data: result });
    } catch (error) {
      console.error('Error en el controlador de registro:', error);

      let errorMessage = 'Error interno del servidor';
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
        errorMessage = 'Nombre de usuario ya en uso';
      }

      res.status(500).send({ status: 'error', error: errorMessage });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).send({ status: 'error', error: "User doesn't exist" });
      }

      const isValidPassword = await passwordValidation(user, password);

      if (!isValidPassword) {
        return res.status(400).send({ status: 'error', error: 'Incorrect password' });
      }

      const userDto = UserDTO.getUserTokenFrom(user);
      const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: '1h' });
      res.cookie('coderCookie', token, { maxAge: 3600000 });
      res.redirect('/products');
    } catch (error) {
      console.error('Error en el controlador de login:', error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
  }

  async current(req, res) {
    try {
      const cookie = req.cookies['coderCookie'];
      const user = jwt.verify(cookie, 'tokenSecretJWT');
      if (user) {
        return res.send({ status: 'success', payload: user });
      }
    } catch (error) {
      console.error('Error en el controlador de current:', error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
  }

  async unprotectedLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).send({ status: 'error', error: "User doesn't exist" });
      }

      const isValidPassword = await passwordValidation(user, password);
      if (!isValidPassword) {
        return res.status(400).send({ status: 'error', error: 'Incorrect password' });
      }

      const token = jwt.sign(user, 'tokenSecretJWT', { expiresIn: '1h' });
      res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({ status: 'success', message: 'Unprotected Logged in' });
    } catch (error) {
      console.error('Error en el controlador de unprotectedLogin:', error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
  }

  async unprotectedCurrent(req, res) {
    try {
      const cookie = req.cookies['unprotectedCookie'];
      const user = jwt.verify(cookie, 'tokenSecretJWT');
      if (user) {
        return res.send({ status: 'success', payload: user });
      }
    } catch (error) {
      console.error('Error en el controlador de unprotectedCurrent:', error);
      res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
  }
}

  
  

module.exports = SessionsController;

  





