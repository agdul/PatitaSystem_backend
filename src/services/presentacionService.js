const db = require('../models');
const Presentacion = db.Presentacion;
const AppError = require('../utilits/helpers/errors');
const ProductoService = require('../services/productoService');
const productoService = new ProductoService();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



class PresentacionService {
  constructor() {
    this.presentacion = Presentacion;
  }

  async getAll() {
    return await this.presentacion.findAll({
      include: [{ association: "producto" }],
    });
  }

  async getById(id_presentacion) {
    return await this.presentacion.findOne({
      where: { id_presentacion: id_presentacion },
      include: [{ association: "producto" }],
    });
  }

  async create(data) {
    const t = await db.sequelize.transaction();
    try {
      const { nombre_presentacion, id_producto } = data;

      await productoService.verificarProductoActivo(id_producto);
      await this.existeNombrePresentacion(nombre_presentacion);
      //await this.presentacion.existeById(id_producto);
      
      const nuevaPresentacion = await this.presentacion.create(data, {
        transaction: t,
      });
      await t.commit();

      return nuevaPresentacion;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(data) {
    const t = await db.sequelize.transaction();
    try {
      const { id_presentacion } = data;
      await this.existeById(id_presentacion);

      await this.presentacion.update(data, {
        where: { id_presentacion },
        transaction: t,
      });

      await t.commit();
      return await this.getById(id_presentacion);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }


  async delete(id_presentacion) {
    const t = await db.sequelize.transaction();
    try {
      const deleted = await this.presentacion.destroy({
        where: { id_presentacion: id_presentacion },
        transaction: t,
      });
      await t.commit();
      return deleted;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  async getByNombre(nombre_presentacion, idExcluir = null) {
    const where = { nombre_presentacion };
    if (idExcluir) {
        where.id_presentacion = { [Op.ne]: idExcluir }; // Excluir la presentación con este ID
    }
    return await this.presentacion.findOne({ 
        where,
        include: [{ association: "producto" }] // Opcional: incluir relación con producto
    });
}
  async existeById(id_presentacion) {
    try {
      const existePresentacion = await this.presentacion.findOne({
        where: { id_presentacion },
      });
      if (!existePresentacion) {
        throw new AppError("Presentación no encontrada", 404);
      }
      return existePresentacion;
    } catch (error) {
      throw error;
    }
  }

  async getAllByProducto(id_producto) {
    return await this.presentacion.findAll({
      where: { id_producto },
      include: [{ association: "producto" }],
    });
  }


  async existeNombrePresentacion(nombre_presentacion){
    try {
      const existePresentacion = await this.presentacion.findOne({
        where: { nombre_presentacion },
      });
      if (existePresentacion) {
        throw new AppError("La presentación ya existe", 400);
      }
      return existePresentacion;
    } catch (error) {
      throw error;
      
    }
  }

  async descontarStock(id_presentacion, cantidad, options = {}) {
  const presentacion = await this.presentacion.findOne({ where: { id_presentacion } });

  if (!presentacion) {
    throw new AppError("Presentación no encontrada", 404);
  }

  if (presentacion.stock < cantidad) {
    throw new AppError(`Stock insuficiente. Disponible: ${presentacion.stock}`, 400);
  }

  // Descontar
  presentacion.stock -= cantidad;
  await presentacion.save(options);
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



  // async verificarPresentacionActivo(id_presentacion) {
  //   const presentacion = await this.existeById(id_presentacion);
  //   if (presentacion.estado !== 'Activo' && producto.estado !== true) {
  //       throw new AppError('El producto no está activo', 400);
  //   }
  //   return presentacion;
  // }

  // const getAllPresentaciones = async () => {
  //   const productos = await Producto.findAll({
  //     include: [{
  //       model: Presentacion,
  //       as: 'presentaciones'
  //     }]
  //   });
  
  //   return productos;
  // };


}

module.exports = PresentacionService;
