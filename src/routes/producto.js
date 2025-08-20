const { Router } = require('express');
const ProductoHandler = require('../handlers/productoHandler');
const PresentacionHandler = require('../handlers/presentacionHandler');

const { verificarTokenMiddlerware } = require('../middleware/tokenMiddleware');
const { authAdmin } = require('../middleware/authMiddleware');


const router = Router();
 
router.get('/presentacion', PresentacionHandler.getTodasPresentaciones);
router.get('/:id/presentacion', PresentacionHandler.getAllByProducto);
router.get('/:id/presentacion/:id_presentacion', PresentacionHandler.getPresentacion);
router.post('/:id/presentacion', verificarTokenMiddlerware, authAdmin,PresentacionHandler.createPresentacion);
router.put('/:id/presentacion/:id_presentacion', verificarTokenMiddlerware, authAdmin, PresentacionHandler.updatePresentacion);
router.delete('/:id/presentacion/:id_presentacion', verificarTokenMiddlerware, authAdmin, PresentacionHandler.deletePresentacion);

// ---------------------------------------------------------------------

router.get('/', ProductoHandler.getProducto);
router.get('/:id', ProductoHandler.getProducto);
router.post('/', verificarTokenMiddlerware, authAdmin, ProductoHandler.createProducto);
router.put('/:id', verificarTokenMiddlerware, authAdmin, ProductoHandler.updateProducto);
router.delete('/:id', verificarTokenMiddlerware, authAdmin, ProductoHandler.deleteProducto);




module.exports = router;

// const express = require('express'); 
// const productoHandler  = require('../handlers/productoHandler');


// class ProductoRouter {
//     constructor() {
//         this.router = express.Router();
//         this.routes();
//     }

//     routes() {
//         this.router.get('/', productoHandler.getProducto);
//         this.router.get('/:id', productoHandler.getProducto);
//         this.router.post('/', productoHandler.createProducto);
//         this.router.put('/:id', productoHandler.updateProducto);
//         this.router.delete('/:id', productoHandler.deleteProducto);
//     }
// }