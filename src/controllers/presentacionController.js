const db = require('../models');
const PresentacionService = require("../services/presentacionService");
const presentacionService = new PresentacionService();
const ProductoService = require("../services/productoService");
const productoService = new ProductoService();
const AppError = require("../utilits/helpers/errors");

class PresentacionController {
  static async getAll() {
    try {
      const presentaciones = await presentacionService.getAll();
      if (!presentaciones || presentaciones.length === 0) {
        throw new AppError("No se encontraron presentaciones", 404);
      }
      return presentaciones;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const presentacion = await presentacionService.getById(id);
      if (!presentacion) {
        throw new AppError("Presentación no encontrada", 404);
      }
      return presentacion;
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const { nombre_presentacion, id_producto } = data;
      const productoExiste = await productoService.existeById(id_producto);
      if (!productoExiste) {
        throw new AppError("El producto por id url no existe", 404);
      }
      await this.existeByNombre(nombre_presentacion);
      return await presentacionService.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async update(id_presentacion, data) {
    const t = await db.sequelize.transaction();
    try {
        const presentacionActual = await presentacionService.getById(id_presentacion);
        if (!presentacionActual) {
            throw new AppError("Presentación no encontrada", 404);
        }

        // Validar producto SOLO si se está cambiando el id_producto
        if (data.id_producto && data.id_producto !== presentacionActual.id_producto) {
            await productoService.verificarProductoActivo(data.id_producto);
        }

        // Validar unicidad del nombre (si se modifica)
        if (data.nombre_presentacion && data.nombre_presentacion !== presentacionActual.nombre_presentacion) {
            const presentacionExistente = await presentacionService.getByNombre(
                data.nombre_presentacion,
                id_presentacion
            );
            if (presentacionExistente) {
                throw new AppError("Ya existe otra presentación con ese nombre", 400);
            }
        }

        // Actualizar
        data.id_presentacion = id_presentacion;
        const presentacion = await presentacionService.update(data, { transaction: t });
        await t.commit();
        return presentacion;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}
  static async delete(id_presentacion) {
    try {
      return await presentacionService.delete(id_presentacion);
    } catch (error) {
      throw error;
    }
  }

  static async existeById(id) {
    try {
      const presentacion = await presentacionService.getById(id);
      if (!presentacion) {
        throw new AppError("Presentación no encontrada", 404);
      }
      return presentacion;
    } catch (error) {
      throw error;
    }
  }
  static async existeByNombre(nombre) {
    try {
      const presentacion = await presentacionService.getByNombre(nombre);
      if (presentacion) {
        throw new AppError("La presentación ya existe", 400);
      }
      return presentacion;
    } catch (error) {
      throw error;
    }
  }

  static async getAllByProducto(id) {
    try {
      const productoExiste = await productoService.existeById(id);
      if (!productoExiste) {
        throw new AppError("El producto no existe", 404);
      }
      const presentaciones = await presentacionService.getAllByProducto(id);
      return presentaciones;
    } catch (error) {
      throw error;
    }
  }

  static async getTodasPresentaciones(){
    try {
      const presentaciones = await presentacionService.getAll();
      if (!presentaciones || presentaciones.length === 0) {
        throw new AppError("No se encontraron presentaciones", 404);
      }
      return presentaciones;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PresentacionController;
