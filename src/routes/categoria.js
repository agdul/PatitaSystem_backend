const { Router } = require('express');
const CategoriaHandler = require('../handlers/categoriaHandler');


const router = Router();
 
router.get('/', CategoriaHandler.getTodasCategorias);
router.get('/:id_categoria', CategoriaHandler.getCategoriaById);
router.post('/', CategoriaHandler.createCategoria);
router.put('/:id_categoria', CategoriaHandler.updateCategoria);
router.delete('/:id_categoria', CategoriaHandler.deleteCategoria);

// ---------------------------------------------------------------------



module.exports = router;