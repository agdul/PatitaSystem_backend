const CarritoController = require('../controllers/carritoController');
const AppError = require('../utilits/helpers/errors');

class CarritoHandler {

  static async verCarrito(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        throw new AppError('Usuario no autenticado', 401);
      }

      const carrito = await CarritoController.verCarrito(id_usuario);
      res.status(200).json(carrito);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('❌ Error al obtener el carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async agregarProductoCarrito(req, res) {
    try {
      //const id_usuario = req.user?.id_usuario;
      const { id_presentacion, cantidad, id_usuario } = req.body;

      if (!id_usuario || !id_presentacion || !cantidad ) {
        throw new AppError('Faltan datos requeridos: id_presentacion, cantidad', 400);
      }

      const data = { id_usuario, id_presentacion, cantidad };
      const result = await CarritoController.agregarProductoCarrito(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('❌ Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async modificarProductoCarrito(req, res) {
    try {
      const { id_carrito_detalle } = req.params;
      const { cantidad } = req.body;
  
      if (!id_carrito_detalle || !cantidad) {
        throw new AppError('Faltan datos requeridos: id_carrito_detalle y cantidad', 400);
      }
  
      const result = await CarritoController.modificarProductoCarrito({ id_carrito_detalle, cantidad });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('❌ Error al modificar producto del carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
  static async eliminarProductoCarrito(req, res) {
    try {
      const { id_carrito_detalle } = req.params;
  
      if (!id_carrito_detalle) {
        throw new AppError('Falta el ID del producto a eliminar', 400);
      }
  
      const result = await CarritoController.eliminarProductoCarrito(id_carrito_detalle);
      res.status(200).json({ message: 'Producto eliminado del carrito', result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('❌ Error al eliminar producto del carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }

  static async vaciarCarrito(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
  
      if (!id_usuario) {
        throw new AppError('Usuario no autenticado', 401);
      }
  
      const result = await CarritoController.vaciarCarrito(id_usuario);
      res.status(200).json({ message: 'Carrito vaciado con éxito', result });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error('❌ Error al vaciar carrito:', error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
  }
}

module.exports = CarritoHandler;