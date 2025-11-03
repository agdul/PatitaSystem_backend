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

  // ------------------------------------------------------------------
  //          *** CRUD PRODUCTO ***
  
  // Obtener todos los productos
  async getAll() {
    return await this.producto.findAll({
      include: [{ association: "categoria" }],
    });
  };

  // Obtener un producto por id
  async getById(id) {
    return await this.producto.findOne({
      where: { id_producto: id },
      include: [{ association: "categoria" }],
    });
  };

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
  };

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
  };

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
  };

  // ------------------------------------------------------------------
  //      *** Validaciones Producto ***

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
    const producto = await this.getById(id_producto);
    const estado = producto.estado_producto;
    //console.log('Producto verificado:', producto);
    if (!(estado === 1 || estado === '1')) {
      throw new AppError('Producto no esta activo', 404);
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

  // ------------------------------------------------------------------
  //        *** Búsqueda y filtrado de productos (MSSQL) ***

  /**
   * Busca productos para autocomplete / filtro en MSSQL.
   * Case-insensitive con LOWER(col) LIKE 'q%'.
   *
   * @param {Object} params
   * @param {string|null} params.q             Prefijo para nombre (min. recomendado 2)
   * @param {string|number|null} params.categoria  Id numérico o prefijo del nombre de categoría
   * @param {string|boolean|number|null} params.estado  "activo"/"inactivo" | true/false | 1/0 | "1"/"0"
   * @param {number} params.limit              1..100
   * @param {number} params.offset             >= 0
   * @returns {Promise<Array<Producto>>}
   */
async search({ q, categoria, estado, limit = 20, offset = 0 }) {
  const where = {};

  // --- Filtro por estado_producto (tolerante a tipos) ---
  if (estado !== null && estado !== undefined) {
    let target;
    if (typeof estado === 'string') {
      const s = estado.toLowerCase();
      if (s === 'activo') target = '1';
      else if (s === 'inactivo') target = '0';
      else if (s === '1' || s === '0') target = s;
      else if (s === 'true') target = '1';
      else if (s === 'false') target = '0';
    } else if (typeof estado === 'boolean') {
      target = estado ? '1' : '0';
    } else if (typeof estado === 'number') {
      target = String(estado === 1 ? 1 : 0);
    }
    if (target !== undefined) {
      where.estado_producto = target;
    }
  }

  // --- Búsqueda por N términos: cada término debe aparecer como subcadena ---
  //   Ej: q="don per"  =>  LOWER(nombre) LIKE '%don%' AND LIKE '%per%'
  const andParts = [];
  if (q && q.trim().length > 0) {
    const terms = q.trim().toLowerCase().split(/\s+/);

    for (const t of terms) {
      const likeContains = `%${t}%`;
      andParts.push(
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('Producto.nombre_producto')),
          { [Op.like]: likeContains }
        )
      );
    }
  }
  if (andParts.length) {
    // Si ya hay condiciones en where, combinamos con AND
    where[Op.and] = (where[Op.and] || []).concat(andParts);
  }

  // --- Include de categoría (con/sin filtro) ---
  const include = [];
  if (categoria !== null && categoria !== undefined && categoria !== '') {
    const isNumeric = !isNaN(Number(categoria));
    if (isNumeric) {
      include.push({
        association: "categoria",
        where: { id_categoria: Number(categoria) },
        required: true
      });
    } else {
      const likeCategoria = `${String(categoria).toLowerCase()}%`;
      include.push({
        association: "categoria",
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('categoria.nombre_categoria')),
              { [Op.like]: likeCategoria }
            )
          ]
        },
        required: true
      });
    }
  } else {
    include.push({ association: "categoria" });
  }

  // --- Atributos mínimos para dropdown ---
  const attributes = [
    'id_producto',
    'nombre_producto',
    'id_categoria',
    'estado_producto'
  ];

  const order = [['nombre_producto', 'ASC']];

  return await this.producto.findAll({
    where,
    include,
    attributes,
    limit,
    offset,
    order
  });
}
}

module.exports = ProductoService;
