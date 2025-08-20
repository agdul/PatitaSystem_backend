const CarritoController = require('../controllers/carritoController');
const VentaController = require('../controllers/ventaController');
const AppError = require('../utilits/helpers/errors');

class VentaHandler {

  // POST /venta
  static async crearVenta(req, res) {
    try {
      const id_usuario = req.user.id_usuario;
      const { metodos_pago } = req.body;

      if (!Array.isArray(metodos_pago) || metodos_pago.length === 0) {
        throw new AppError('Debe enviar al menos un método de pago', 400);
      }

      const venta = await VentaController.crearVenta(id_usuario, metodos_pago);
      return res.status(201).json(venta);
    } catch (error) {
      console.error('❌ Error al crear venta:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno al generar la venta', error: error.message });
    }
  }

  // GET /venta
  static async getVentas(req, res) {
    try {
      const id_usuario = req.user.id_usuario;
      const id_rol = req.user.id_rol;

      const ventas = await VentaController.getVentas(id_usuario, id_rol);
      res.status(200).json(ventas);
    } catch (error) {
      console.error('❌ Error al obtener ventas:', error);
      res.status(500).json({ message: 'Error interno al obtener ventas', error: error.message });
    }
  }

  // GET /venta/:id_venta
  static async getVentaById(req, res) {
    try {
      const id_venta = req.params.id_venta;
      const venta = await VentaController.getVentaById(id_venta);
      res.status(200).json(venta);
    } catch (error) {
      console.error('❌ Error al obtener venta:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Error interno al obtener venta', error: error.message });
    }
  }
}

module.exports = VentaHandler;
