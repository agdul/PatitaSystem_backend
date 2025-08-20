const db = require('../models');
const CarritoDetalle = db.CarritoDetalle;
const AppError = require('../utilits/helpers/errors');

class CarritoDetalleService {
  constructor() {
    this.detalle = CarritoDetalle;
  }

  async getById(id_carrito_detalle, options = {}) {
    const detalle = await this.detalle.findOne({
      where: { id_carrito_detalle },
      transaction: options.transaction // ✅ importante
    });
  
    if (!detalle) {
      throw new AppError("Producto del carrito no encontrado", 404);
    }
  
    return detalle;
  }
  
  async create(data, options = {}) {
    const nuevoDetalle = await this.detalle.create(data, options);
    return nuevoDetalle;
  }

  async update(data, options = {}) {
    const { id_carrito_detalle, cantidad } = data;
  
    await this.detalle.update(
      { cantidad },
      {
        where: { id_carrito_detalle },
        transaction: options.transaction
      }
    );
  
    // 💡 Retornar el detalle actualizado dentro de la MISMA transacción
    return await this.getById(id_carrito_detalle, options);
  }
  
  async delete(id_carrito_detalle) {
    const t = await db.sequelize.transaction();
    try {
      const detalle = await this.getById(id_carrito_detalle);
      const deleted = await this.detalle.destroy({
        where: { id_carrito_detalle },
        transaction: t
      });
      await t.commit();
      return deleted;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async deleteAllByCarritoId(id_carrito, options = {}) {
    return await this.detalle.destroy({
      where: { id_carrito },
      transaction: options.transaction,
    });
  }

  async getByCarritoAndPresentacion(id_carrito, id_presentacion) {
    return await this.detalle.findOne({
      where: {
        id_carrito,
        id_presentacion
      }
    });
  }

  async getAllByCarritoId(id_carrito, options = {}) {
  return await this.detalle.findAll({
    where: { id_carrito },
    transaction: options.transaction
  });
  }

}

module.exports = CarritoDetalleService;
