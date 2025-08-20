const db = require('../models');
const CategoriaService = require("../services/categoriaService");
const categorianService = new CategoriaService();

const AppError = require("../utilits/helpers/errors");

class CategoriaController {
  // -----------------------------------------------------------------------
  //------------------   CRUD CATEGORIA   ---------------------------
  // -----------------------------------------------------------------------
  static async getTodasCategorias() {
    try {
      const categorias = await categorianService.getAll();
      if (!categorias || categorias.length === 0) {
        throw new AppError("No se encontraron categorías", 404);
      }
      return categorias;
    } catch (error) {
      throw error;
    }
  }
  static async getCategoriaById(id_categoria) {
    try {
      const categoria = await categorianService.getById(id_categoria);
      if (!categoria) {
        throw new AppError("Categoría no encontrada", 404);
      }
      return categoria;
    } catch (error) {
      throw error;
    }
  }
  static async createCategoria(data) {
    try {
      const nuevaCategoria = await categorianService.create(data);
      if (!nuevaCategoria) {
        throw new AppError("Error al crear la categoría", 400);
      }
      return nuevaCategoria;
    } catch (error) {
      throw error;
    }
  }
  static async updateCategoria(data) {
    try {
      const { id_categoria, nombre_categoria } = data;
  // -----------------------------------------------------------------------
      // Verificar existencia
      const categoriaActual = await categorianService.getById(id_categoria);
      if (!categoriaActual) {
        throw new AppError("Categoría no encontrada", 404);};
      // Verificar validación de nombre al service
      await categorianService.verificarNombreDisponible(nombre_categoria,id_categoria);
   // -----------------------------------------------------------------------
      const categoriaActualizada = await categorianService.update(data);
      if (!categoriaActualizada) {
        throw new AppError("Error al actualizar la categoría", 400);
      }
      return categoriaActualizada;
    } catch (error) {
      throw error;
    }
  }
  // --------------------------------------------------------------------
  // -----------  Logica del negocio  ------------------------------
  // --------------------------------------------------------------------

  async verificarNombreDisponible(nombre_categoria, id_categoria) {
    try {
      const existente = await categorianService.findOne({
        where: {
          nombre: nombre_categoria,
          id: { [Op.ne]: id_categoria }, // excluye el actual
        },
      });
      // YA EXISTE otra categoría con ese nombre -> NO disponible
      if (existente) {
        throw new AppError("El nombre de la categoría ya está en uso", 400);
      }
      // Entonces NO EXISTE ninguna otra con ese nombre -> SÍ está disponible
      return existente; // true si está disponible para otro
    } catch (error) {
      throw new AppError('Error al verificar si el nombre de la categoría está disponible', 400);
    }
  }
  
  // -----------------------------------------------------------------------
}


module.exports = CategoriaController;