const MetodoPagoController = require('../controllers/metodoPagoController');
const AppError = require('../utilits/helpers/errors');

class MetodoPagoHandler {

  // GET /metodoPago
  static async getMetodosPago(req, res) {
    try {
      const metodos = await MetodoPagoController.getMetodos();
      res.status(200).json(metodos);
    } catch (error) {
      console.error('❌ Error al obtener métodos de pago:', error);
      res.status(500).json({ message: 'Error interno al listar métodos de pago' });
    }
  }

  // POST /metodoPago
  static async crearMetodoPago(req, res) {
    try {
      const { descripcion } = req.body;

      if (!descripcion) {
        throw new AppError('Debe proporcionar una descripción', 400);
      }

      const metodo = await MetodoPagoController.crearMetodoPago(descripcion);
      res.status(201).json(metodo);
    } catch (error) {
      console.error('❌ Error al crear método de pago:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno al crear método de pago' });
    }
  }

  // DELETE /metodoPago/:id_metodo_pago
  static async eliminarMetodoPago(req, res) {
    try {
      const { id_metodo_pago } = req.params;
      await MetodoPagoController.eliminarMetodoPago(id_metodo_pago);
      res.status(200).json({ message: 'Método de pago eliminado correctamente' });
    } catch (error) {
      console.error('❌ Error al eliminar método de pago:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno al eliminar método de pago' });
    }
  }
}

module.exports = MetodoPagoHandler;
