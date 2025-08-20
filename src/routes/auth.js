const express = require ('express');

const AuthHandler = require('../handlers/authHandler');

const router = express.Router();

//roota para el inicio de sesión
router.post('/login', AuthHandler.login);
//ruta para el registro de usuario
router.post('/registro', AuthHandler.register);
//ruta para cerrar sesión
router.post('/logout', AuthHandler.logout);

module.exports = router;