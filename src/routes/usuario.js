const express = require ('express');
const UsuarioHandler = require('../handlers/usuarioHandler');
const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');


const router = express.Router();

// ---------------------------------------------------------------
// Busqueda / Filtrado Usuarios

// GET /usuarios?q=texto&email=...&dni=...&telefono=...&limit=10&offset=0
router.get('/search', verificarTokenMiddlerware, authAdmin, UsuarioHandler.listUsuarios);

// GET /usuario/search/by-email/:email
router.get('/search/by-email/:email', verificarTokenMiddlerware, authAdmin, UsuarioHandler.getUsuarioByEmail);


//---------------------------------------------------------------
// Rutas Usuarios -- Crud
//--- Obtener todos los usuarios
router.get('/', verificarTokenMiddlerware, authAdmin, UsuarioHandler.getUsuario);

//--- Usuario por ID
router.get('/:id', verificarTokenMiddlerware, authAdmin, UsuarioHandler.getUsuario);

//--- Crear un nuevo usuario
router.post('/', verificarTokenMiddlerware, authAdmin, UsuarioHandler.createUsuario);

//--- Actualizar un usuario
router.put('/:id', verificarTokenMiddlerware, authAdmin, UsuarioHandler.updateUsuario);

//--- Eliminar un usuario
router.delete('/:id', verificarTokenMiddlerware, authAdmin, UsuarioHandler.deleteUsuario);
//---------------------------------------------------------------



module.exports = router;