// routes/users.routes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  // Importa otras funciones según sea necesario
} = require('../controllers/userController');

// Definir rutas
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
// Agrega otras rutas según sea necesario

module.exports = router;
