const express = require('express');
const { Router } = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/userController');

// Crear un router de Express
const router = Router();

// Definir rutas
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);

module.exports = router;

