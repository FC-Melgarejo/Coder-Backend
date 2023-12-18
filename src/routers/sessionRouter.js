const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionController.js');
const UserService = require('../services/userService.js');
const { createHash, passwordValidation } = require('../utils/passwordHash.js');
const jwt = require('jsonwebtoken');
const UserDTO = require('../DTO/userDTO.js');

// Resto del código...

router.post('/register', sessionsController.register);
router.post('/login', sessionsController.login);
router.get('/current', sessionsController.current);
router.get('/unprotectedLogin', sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

module.exports = router;



