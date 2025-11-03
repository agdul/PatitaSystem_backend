const ProductoService = require("../services/productoService");
const productoService = new ProductoService();
const AppError = require("../utilits/helpers/errors");

class ProductoController {
  static async getAll() {
    try {
      const productos = await productoService.getAll();
      if (!productos || productos.length === 0) {
        throw new Error("No se encontraron productos", 404);
      }
      return productos;
    } catch (error) {
      throw error;
    }
  };

  static async getById(id_producto) {
    try {
      const producto = await productoService.getById(id_producto);
      return producto;
    } catch (error) {
      throw error;
    }
  };

  static async create(data) {
    try {
      const { nombre_producto } = data;

      await this.existeByNombre(nombre_producto);
      //await productoService.verificarProductoActivo(data.id_producto);

      const producto = await productoService.create(data);
      return producto;
    } catch (error) {
      throw error;
    }
  };

  static async update(id, data) {
    try {
      // 1. Validar que el producto existe
      await this.existeById(id);

      // 2. Validar unicidad del nombre (excluyendo el producto actual)
      if (data.nombre_producto) {
        const existeNombre = await productoService.existeByNombre(
          data.nombre_producto,
          id
        );
        if (existeNombre) {
          throw new AppError("El producto ya existe", 400);
        }
      }

      // 3. Actualizar
      const producto = await productoService.update(id, data);
      return producto;
    } catch (error) {
      throw error;
    }
  };

  static async delete(id_producto) {
    try {
      const producto = await productoService.delete(id_producto);
      return producto;
    } catch (error) {
      throw error;
    }
  };

  static async existeByNombre(nombre_producto) {
    try {
      const existeProducto = await productoService.existeByNombre(
        nombre_producto
      );
      if (existeProducto) {
        throw new AppError("El producto ya existe", 400);
      }
      return existeProducto;
    } catch (error) {
      throw error;
    }
  };

  static async existeById(id_producto) {
    try {
      const existeProducto = await productoService.existeById(id_producto);
      if (!existeProducto) {
        throw new AppError("El producto no existe", 404);
      }
      return existeProducto;
    } catch (error) {
      throw error;
    }
  };

  // ---------------------------------------------------------------
  //        *** Helper ***

 static toResumeDto(producto) {
    const estadoRaw = producto.estado_producto; // "1" | "0" (string) o boolean
    const activo = String(estadoRaw) === '1' || estadoRaw === true;

    return {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      id_categoria: producto.id_categoria,
      estado_producto: estadoRaw,
      activo, // boolean normalizado (útil para WinForms)
      categoria: producto.categoria ? producto.categoria.nombre_categoria : undefined
    };
  }

// ----------------------------------------------------------------
//       *** Busqueda // Filtro ***

static async listProductos({ q, categoria, estado, limit = 20, offset = 0 }) {
  try {
    const query = q && q.trim().length >= 2 ? q.trim() : (q ? q.trim() : null);

    const productos = await productoService.search({
      q: query,
      categoria: categoria ? String(categoria).trim() : null,
      estado: estado !== undefined ? estado : null,
      limit,
      offset
    });

    return productos.map(this.toResumeDto);

  } catch (error) {
    throw error; 
  }
}

}

module.exports = ProductoController;
