const express = require('express');
const userModel = require('../dao/models/userModel');

const sessionRouter = express.Router();

sessionRouter.get('/', (req, res) => {
    if (!req.session.counter) {
        req.session.counter = 1;
        req.session.name = req.query.name;

        return res.json(`Bienvenido ${req.session.name}`);
    } else {
        req.session.counter++;

        return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`);
    }
});

// Ruta para verificar la autenticación del usuario
const authMiddleware = (req, res, next) => {
    if (!req.session.username) {
        return res.status(401).send('Necesitas iniciar sesión para ver esta página.');
    }

    return next();
};

// Ruta para verificar si el usuario es administrador
const adminMiddleware = (req, res, next) => {
    if (!req.session.admin) {
        return res.status(401).send('Necesitas ser administrador para ver esta página.');
    }

    return next();
};

sessionRouter.get('/auth', authMiddleware, (req, res) => {
    return res.send(`Si puedes ver esta ruta es porque estás logueado. Bienvenido ${req.session.username}`);
});

sessionRouter.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    return res.send(`Si puedes ver esta ruta es porque eres administrador. Bienvenido ${req.session.username}`);
});

// Otras rutas y lógica
// ...

module.exports = sessionRouter;

