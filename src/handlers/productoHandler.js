const ProductoController = require('../controllers/productoController');
const AppError = require('../utilits/helpers/errors');

class productoHandler{
    static async getProducto(req, res) {
        try {
            const { id } = req.params;
            const producto = id ? await ProductoController.getById(id) : await ProductoController.getAll();
    
            res.status(200).json(producto);
        } catch (error) {
            if (error.message === 'No se encontraron productos') {
                return res.status(404).json({ message: error.message });
            }
            console.error('❌ Error al obtener el producto:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };

    static async createProducto(req, res) {
        try {
            const data = req.body;
            if (!data){
                return res.status(400).json({ message: 'Datos del producto son requeridos' });
            }
            const producto = await ProductoController.create(data);
            res.status(201).json(producto);
        } catch (error) {
            console.error('❌ Error al crear el producto:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            // Manejo de errores genérico
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };

    static async updateProducto(req, res) {
        try {
            const { id } = req.params;
            const  data  = req.body;

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: 'Datos del producto son requeridos' });
            }

            const producto = await ProductoController.update(id, data);
            res.status(200).json(producto);
        } catch (error) {
            console.error('❌ Error al actualizar el producto:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };

    static async deleteProducto(req, res) {
        try {
            const { id } = req.params;
            const producto = await ProductoController.delete(id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error('❌ Error al eliminar el producto:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    };


    async verificarProductoActivo(id_producto) {
    const producto = await db.Producto.findByPk(id_producto);
    if (!producto) {
        throw new AppError('Producto no encontrado', 404);
    }
    if (producto.estado !== 'Activo' && producto.estado !== true) {
        throw new AppError('El producto no está activo', 400);
    }
    return producto;
}

};

module.exports = productoHandler;