const db = require("../models");
const AppError = require("../utilits/helpers/errors");

const PresentacionService = require("../services/presentacionService");
const presentacionService = new PresentacionService();

const VentaService = require("../services/ventaService");
const ventaService = new VentaService();

const VentaDetalleService = require("../services/ventaDetalleService");
const ventaDetalleService = new VentaDetalleService();

const VentaMetodoPagoService = require("../services/ventaMetodoPagoService");
const ventaMetodoPagoService = new VentaMetodoPagoService();

const CarritoService = require("../services/carritoService");
const carritoService = new CarritoService();

const CarritoDetalleService = require("../services/carritoDetalleService");
const carritoDetalleService = new CarritoDetalleService();

class VentaController {
  static async crearVenta(id_usuario, metodos_pago) {
    const t = await db.sequelize.transaction();
    try {
      // Obtener el carrito activo del usuario
      const carrito = await carritoService.getCarritoActivo(id_usuario);
      if (!carrito) {
        throw new AppError("No se encontró un carrito activo", 404);
      }

      // Obtener los productos del carrito
      const detalles = await carritoDetalleService.getAllByCarritoId(
        carrito.id_carrito
      );
      if (!detalles || detalles.length === 0) {
        throw new AppError("El carrito está vacío", 400);
      }

      // Calcular el total de la venta
      let total = 0;
      for (const d of detalles) {
        total += d.precio_unitario * d.cantidad;
      }

      // Crear la venta
      const nuevaVenta = await ventaService.create(
        {
          id_usuario,
          fecha: new Date(),
          total,
        },
        { transaction: t }
      );

      // Validar stock disponible ANTES de descontarlo
      for (const detalle of detalles) {
        await presentacionService.verificarStockDisponible(
          detalle.id_presentacion,
          detalle.cantidad
        );
      }

      // Descontar stock de cada presentación
      for (const detalle of detalles) {
        await presentacionService.descontarStock(
          detalle.id_presentacion,
          detalle.cantidad,
          { transaction: t }
        );
      }

      // Crear los detalles de la venta
      for (const detalle of detalles) {
        await ventaDetalleService.create(
          {
            id_venta: nuevaVenta.id_venta,
            id_presentacion: detalle.id_presentacion,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
          },
          { transaction: t }
        );
      }

      let sumaMontos = 0;
      for (const mp of metodos_pago) {
        if (!mp.id_metodo_pago || !mp.monto) {
          throw new AppError(
            "Cada método de pago debe tener id_metodo_pago y monto",
            400
          );
        }

        sumaMontos += parseFloat(mp.monto);

        await ventaMetodoPagoService.create(
          {
            id_venta: nuevaVenta.id_venta,
            id_metodo_pago: mp.id_metodo_pago,
            monto: mp.monto,
          },
          { transaction: t }
        );
      }

      // Validar que la suma de los montos coincida con el total
      if (parseFloat(sumaMontos.toFixed(2)) !== parseFloat(total.toFixed(2))) {
        throw new AppError(
          "La suma de los montos no coincide con el total de la venta",
          400
        );
      }

      // Marcar el carrito como "cerrado"
      await carritoService.cerrarCarrito(carrito.id_carrito, {
        transaction: t,
      });

      // Confirmar la transacción
      await t.commit();
      return nuevaVenta;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getVentas(id_usuario, id_rol) {
    try {
      // Si es admin, devuelve todas las ventas
      if (id_rol === 2) {
        return await ventaService.getAll();
      }

      // Si es cliente, devuelve solo sus ventas
      return await ventaService.getByUsuario(id_usuario);
    } catch (error) {
      throw error;
    }
  }

  static async getVentaById(id_venta) {
    try {
      const venta = await ventaService.getById(id_venta);
      if (!venta) {
        throw new AppError("Venta no encontrada", 404);
      }
      return venta;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VentaController;
