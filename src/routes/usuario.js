const express = require ('express');
const UsuarioHandler = require('../handlers/usuarioHandler');
const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');


const router = express.Router();

// router.get('/', (req, res) => {
//     res.json({
//         message: 'Bienvenido a la API de usuarios'
//     });
// });


//---------------------------------------------------------------
// Rutas Usuarios 
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