const db = require('../models');
const Categoria = db.Categoria;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const LineaService = require('../services/lineaService');
const lineaService = new LineaService();

const AppError = require('../utilits/helpers/errors');
class CategoriaService {
  constructor() {
    this.categoria = Categoria;
  }

// ---------------------------------------------------------------------------
 //----------------------------CRUD CATEGORIA--------------------------------
// ---------------------------------------------------------------------------
  // Obtener todas las categorias
  async getAll() {
    return await this.categoria.findAll({
      attributes: ["id_categoria", "nombre_categoria"],
      include: [
        {
          association: "productos",
          attributes: ["id_producto", "nombre_producto", "estado_producto"],
        },

        { association: "linea" },
      ],
    });
  }
  // Obtener una categoria por id
  async getById(id) {
    return await this.categoria.findOne({
      attributes: ["id_categoria", "nombre_categoria"],
      where: { id_categoria: id },
      include: [
        {
          association: "productos",
          attributes: ["id_producto", "nombre_producto", "estado_producto"],
        },

        { association: "linea" },
      ],
    });
  }

  async getByName(nombre_categoria) {
    try {
      const categoria = await this.categoria.findOne({
        where: {
          nombre_categoria: {
            [Op.iLike]: `%${nombre_categoria}%`,
          },
        },
      });
      return categoria;
    } catch (error) {
      throw new AppError("Error al buscar la categoría", 500);
    }
  }

  async create(data) {
    const t = await db.sequelize.transaction();
    try {
      const { nombre_categoria, id_linea } = data;  
    //-----------------------------------------------------------
      //-------------- Validaciones -----------------------------
      await this.nombreExiste(nombre_categoria);
      await this.lineaExiste(id_linea);
    //----------------------------------------------------------- 
      const nuevaCategoria = await this.categoria.create({nombre_categoria, id_linea}, {
        transaction: t,
      });
      await t.commit();

      return nuevaCategoria;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(data) {
    const t = await db.sequelize.transaction();
    try {
      
      const { id_categoria, nombre_categoria, id_linea } = data;
    //-----------------------------------------------------------------
      //-------------- Validaciones -----------------------------
      // Verificar si la categoría existe
      await this.categoriaExiste(id_categoria);


      // Verificar si la línea existe
      await this.lineaExiste(id_linea);
//-----------------------------------------------------------
      // const categoriaActualizada = await this.categoria.update(
      //   { nombre_categoria, id_linea },
      //   {
      //     where: { id_categoria: id_categoria },
      //     transaction: t,
      //   }
      // );
      // await t.commit();

      // return categoriaActualizada;

      const [_, [categoriaActualizada]] = await this.categoria.update(
        { nombre_categoria, id_linea },
        {
          where: { id_categoria },
          returning: true,
          transaction: t,
        }
      );
      await t.commit();
      return categoriaActualizada;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id_categoria) {
    const t = await db.sequelize.transaction();
    try {
      // Verificar si la categoría existe
      await this.categoriaExiste(id_categoria);

      const categoriaEliminada = await this.categoria.destroy({
        where: { id_categoria },
        transaction: t,
      });
      await t.commit();

      return categoriaEliminada;
    } catch (error) {
      await t.rollback();
      throw error;
    }

  }
//  ---------------------------------------------------------------------

//------------------------------------------------------------------
 //------------------------- Reglas de negocio ---------------------
//------------------------------------------------------------------
  //validar que el nombre no este en uso de categoria 
  async nombreExiste(nombre_categoria) {
    try {
      const categoria = await this.getByName(nombre_categoria);
      if (categoria) {
        throw new AppError("El nombre de la categoría ya está en uso", 400);
      }
    } catch (error) {
      if (error instanceof AppError) throw error; // si ya es un AppError, relanzarlo
      throw new AppError("Error al verificar existencia del nombre", 500);
    }
  }

  // validar que la linea exista
  async lineaExiste(id_linea) {
    try {
      const linea = await lineaService.getById(id_linea);
      if (!linea) {
        throw new AppError("La línea no existe", 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error al verificar existencia de la línea", 500);
    }
  }
  // validar si existe una categoria 
  async categoriaExiste(id_categoria) {
    try {
      const categoria = await this.getById(id_categoria);
      if (!categoria) {
        throw new AppError("La categoría no existe", 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error al verificar existencia de la categoría", 500);
    }
  }

  async verificarNombreDisponible(nombre_categoria, id_categoria_actual = null) {
    const categoria = await this.getByName(nombre_categoria);
    if (categoria && categoria.id_categoria !== id_categoria_actual) {
        throw new AppError("Ya existe otra categoría con el mismo nombre", 400);
    }
  }

  async existeCategoria(id_categoria) {    
    try {
      const categoria = await this.getById(id_categoria);
      if (!categoria) {
        throw new AppError("La categoría no existe", 404);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error al verificar existencia de la categoría", 400);     
    }
  }

// ---------------------------------------------------------------------

}
module.exports = CategoriaService;