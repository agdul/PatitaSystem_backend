const { Router } = require('express');
const VentaHandler = require('../handlers/ventaHandler');
const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');

const router = Router();

// Crear una venta (a partir del carrito del usuario)
router.post('/', verificarTokenMiddlerware, VentaHandler.crearVenta);

// Obtener todas las ventas (de admin o del usuario)
router.get('/', verificarTokenMiddlerware, VentaHandler.getVentas);

// Obtener una venta específica
router.get('/:id_venta', verificarTokenMiddlerware, VentaHandler.getVentaById);

module.exports = router;
