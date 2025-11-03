const { Router } = require('express');
const LineaHandler = require('../handlers/lineaHandler');

const router = Router();

router.get('/', LineaHandler.getLineas);
router.get('/:id_linea', LineaHandler.getLineaById);
router.post('/', LineaHandler.createLinea);
router.put('/:id_linea', LineaHandler.updateLinea);
router.delete('/:id_linea', LineaHandler.deleteLinea);


// ---------------------------------------------------------------------
module.exports = router;