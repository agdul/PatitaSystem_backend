const db = require('../models');
const AppError = require('../utilits/helpers/errors');
const CarritoService = require('../services/carritoService');
const carritoService = new CarritoService();

const CarritoDetalleService = require('../services/carritoDetalleService');
const carritoDetalleService = new CarritoDetalleService();

const PresentacionService = require('../services/presentacionService');
const presentacionService = new PresentacionService();

const ProductoService = require('../services/productoService');
const productoService = new ProductoService();


class CarritoController {
  static async verCarrito(id_usuario) {
    try {
      const carrito = await carritoService.getCarritoCompleto(id_usuario);
      if (!carrito) {
        throw new AppError('❌ El usuario no tiene nada en el carrito', 404);
      }
      return carrito;
    } catch (error) {
      throw error;
    }
  }

static async agregarProductoCarrito(data) {
  const t = await db.sequelize.transaction();
  try {
    const { id_usuario, id_presentacion, cantidad } = data;

    // Verificar presentación
    const presentacion = await presentacionService.getById(id_presentacion);
    if (!presentacion) {
      throw new AppError('La presentación indicada no existe', 404);
    }

    // Validar stock
    await productoService.verificarStockDisponible(id_presentacion, cantidad);

    // Obtener o crear carrito
    let carrito = await carritoService.getCarritoActivo(id_usuario);
    if (!carrito) {
      carrito = await carritoService.create(
        { id_usuario, estado: 'activo' },
        { transaction: t }
      );
    }

    // ✅ Precio unitario tomado de la presentación
    const precio_unitario = parseFloat((presentacion.precio_compra * (1 + presentacion.porcentaje_aumento / 100)).toFixed(2));


    // Buscar si ya existe ese producto en el carrito
    const detalleExistente = await carritoDetalleService.getByCarritoAndPresentacion(
      carrito.id_carrito,
      id_presentacion
    );

    if (detalleExistente) {
      // Si ya existe, actualizar cantidad
      const nuevaCantidad = detalleExistente.cantidad + cantidad;
      const actualizado = await carritoDetalleService.update(
        {
          id_carrito_detalle: detalleExistente.id_carrito_detalle,
          cantidad: nuevaCantidad,
        },
        { transaction: t }
      );

      await t.commit();
      return actualizado;
    }

    // Si no existe, crear uno nuevo
    const nuevoDetalle = await carritoDetalleService.create(
      {
        id_carrito: carrito.id_carrito,
        id_presentacion,
        cantidad,
        precio_unitario,
      },
      { transaction: t }
    );

    await t.commit();
    return nuevoDetalle;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

  
  static async modificarProductoCarrito(data) {
    const t = await db.sequelize.transaction();
    try {
      const { id_carrito_detalle, cantidad } = data;
  
      // Verificar que el detalle exista
      const detalle = await carritoDetalleService.getById(id_carrito_detalle);
      if (!detalle) {
        throw new AppError('Producto no encontrado en el carrito', 404);
      }
  
      // Calcular nueva cantidad
      const nuevaCantidad = detalle.cantidad + cantidad;
  
      if (nuevaCantidad < 0) {
        throw new AppError(`No podés reducir más de ${detalle.cantidad}`, 400);
      }
  
      // Validar stock solo si se aumenta la cantidad
      if (cantidad > 0) {
        await productoService.verificarStockDisponible(detalle.id_presentacion, nuevaCantidad);
      }
  
      // Si la nueva cantidad es 0 → eliminar el detalle
      if (nuevaCantidad === 0) {
        const eliminado = await carritoDetalleService.delete(id_carrito_detalle);
        await t.commit();
        return { message: 'Producto eliminado del carrito', eliminado };
      }
  
      // Actualizar cantidad
      const actualizado = await carritoDetalleService.update({
        id_carrito_detalle,
        cantidad: nuevaCantidad
      }, { transaction: t });
  
      await t.commit();
      return actualizado;
  
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  
  static async eliminarProductoCarrito(id_carrito_detalle) {
    try {
      // Verificar existencia
      await carritoDetalleService.getById(id_carrito_detalle);
      return await carritoDetalleService.delete(id_carrito_detalle);
    } catch (error) {
      throw error;
    }
  }
  
  static async vaciarCarrito(id_usuario) {
    const t = await db.sequelize.transaction();
    try {
      // Obtener carrito activo
      const carrito = await carritoService.getCarritoActivo(id_usuario);
      if (!carrito) {
        throw new AppError('El usuario no tiene un carrito activo', 404);
      }
  
      // Eliminar todos los detalles asociados
      const eliminados = await carritoDetalleService.deleteAllByCarritoId(carrito.id_carrito, { transaction: t });
  
      await t.commit();
      return { eliminados };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}  

module.exports = CarritoController;
