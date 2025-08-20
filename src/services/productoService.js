const db = require('../models');
const Producto = db.Producto;
const Presentacion = db.Presentacion;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const AppError = require('../utilits/helpers/errors');

class ProductoService {
  constructor() {
    this.producto = Producto;
    this.presentacion = Presentacion;
  }
  // Obtener todos los productos
  async getAll() {
    return await this.producto.findAll({
      include: [{ association: "categoria" }],
    });
  }

  // Obtener un producto por id
  async getById(id) {
    return await this.producto.findOne({
      where: { id_producto: id },
      include: [{ association: "categoria" }],
    });
  }

  // Crear un producto dentro de una transacción
  async create(data) {
    const t = await db.sequelize.transaction(); // Crear transacción
    try {
      await this.existeByNombre(data.nombre_producto); // Verificar si el producto ya existe
     // await this.verificarProductoActivo(data.id_producto); // Verificar si el producto está activo
      // Realizar la operación dentro de la transacción
      const producto = await this.producto.create(data, { transaction: t });
      // Si todo va bien, hacer commit
      await t.commit();
      return producto;
    } catch (error) {
      // Si ocurre un error, hacer rollback
      await t.rollback();
      throw error; // Lanzar el error para ser manejado por quien llame a este servicio
    }
  }

  // Actualizar un producto dentro de una transacción// Actualizar un producto dentro de una transacción
  async update(id, data) {
    const t = await db.sequelize.transaction();
    try {
      const [updated] = await this.producto.update(data, {
        where: { id_producto: id },
        transaction: t,
      });

      if (updated === 0) {
        throw new Error("No se actualizó ningún producto");
      }

      const productoActualizado = await this.producto.findOne({
        where: { id_producto: id },
        transaction: t,
      });

      await t.commit();
      return productoActualizado;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Eliminar un producto dentro de una transacción
  async delete(id) {
    const t = await db.sequelize.transaction();
    try {
      const producto = await this.producto.findOne({
        where: { id_producto: id },
        transaction: t,
      });
      if (!producto) throw new Error("Producto no encontrado");

      await this.producto.destroy({
        where: { id_producto: id },
        transaction: t,
      });

      await t.commit();
      return producto;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Existe Producto con ese nombre
  async existeByNombre(nombre_producto, idExcluir = null) {
    const where = { nombre_producto };
    if (idExcluir) {
        where.id_producto = { [Op.ne]: idExcluir }; // Excluir el producto actual
    }
    const existeProducto = await this.producto.findOne({ where });
    return !!existeProducto;
  }
  async existeById(id_producto) {
    try {
      const existeProducto = await this.producto.findOne({
        where: { id_producto },
      });
      return !!existeProducto;
    } catch (error) {
      throw error;
    }
  }

  async verificarProductoActivo(id_producto) {
    const producto = await this.producto.findOne({
      where: { id_producto }
    });
  
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }
  
    if (producto.estado_producto !== "activo") {
      throw new AppError('El producto no está activo', 400);
    }
  
    return producto;
  }

  async verificarStockDisponible(id_presentacion, cantidadSolicitada) {
    const presentacion = await this.presentacion.findOne({
      where: { id_presentacion }
    });

    if (!presentacion) {
      throw new AppError("La presentación no existe", 404);
    }

    if (presentacion.stock < cantidadSolicitada) {
      throw new AppError(`Stock insuficiente: disponible ${presentacion.stock}`, 400);
    }

    return true;
  }

};

module.exports = ProductoService;
