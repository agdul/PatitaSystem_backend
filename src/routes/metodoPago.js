const { Router } = require('express');
const MetodoPagoHandler = require('../handlers/metodoPagoHandler');
const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');

const router = Router();

// Ver todos los métodos de pago disponibles
router.get('/', MetodoPagoHandler.getMetodosPago);

// Admin: Crear nuevo método de pago
router.post('/', verificarTokenMiddlerware, authAdmin, MetodoPagoHandler.crearMetodoPago);

// Admin: Eliminar un método de pago
router.delete('/:id_metodo_pago', verificarTokenMiddlerware, authAdmin, MetodoPagoHandler.eliminarMetodoPago);

module.exports = router;
