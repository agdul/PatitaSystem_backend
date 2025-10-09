const express = require('express');
const DireccionHandler = require('../handlers/direccionHandler');
const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');

const router = express.Router();


// ---------------------------------------------------------------
// Rutas Direccion 
//--- Obtener todas las direcciones
router.get('/', verificarTokenMiddlerware, authAdmin, DireccionHandler.getDireccion);

//--- Direccion por ID
router.get('/:id', verificarTokenMiddlerware, authAdmin, DireccionHandler.getDireccion);    

//--- Crear una nueva direccion
router.post('/', verificarTokenMiddlerware, authAdmin, DireccionHandler.createDireccion);

//--- Actualizar una direccion
router.put('/:id', verificarTokenMiddlerware, authAdmin, DireccionHandler.updateDireccion); 

//--- Eliminar una direccion        
router.delete('/:id', verificarTokenMiddlerware, authAdmin, DireccionHandler.deleteDireccion);
// ---------------------------------------------------------------

module.exports = router;