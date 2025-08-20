const { Router } = require('express');
const CarritoHandler = require('../handlers/carritoHandler');

const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');


const router = Router();

// Obtener el carrito del usuario autenticado
router.get('/', verificarTokenMiddlerware, CarritoHandler.verCarrito);

// // Agregar un producto al carrito
router.post('/agregar', verificarTokenMiddlerware, CarritoHandler.agregarProductoCarrito);

// // Modificar un producto del carrito
router.put('/modificar/:id_carrito_detalle', verificarTokenMiddlerware, CarritoHandler.modificarProductoCarrito);

// Eliminar un producto del carrito
router.delete('/eliminar/:id_carrito_detalle', verificarTokenMiddlerware, CarritoHandler.eliminarProductoCarrito);

// Eliminar todo el carrito (vaciarlo)
router.delete('/vaciar', verificarTokenMiddlerware, CarritoHandler.vaciarCarrito);

// // Eliminar un producto del carrito
// router.delete('/eliminar/:id_carrito_detalle', CarritoHandler.eliminarProductoCarrito);

module.exports = router;
