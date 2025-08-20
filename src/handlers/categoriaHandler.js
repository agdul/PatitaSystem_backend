const CategoriaController = require('../controllers/categoriaController');
const AppError = require('../utilits/helpers/errors');

class CategoriaHandler {
// -----------------------------------------------------------------

    static async getTodasCategorias (req, res) {
        try {
            const categorias = await CategoriaController.getTodasCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.error('❌ Error al obtener las categorías:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }

    }
    static async getCategoriaById (req, res) {
        const { id_categoria } = req.params;
        try {
            if (!id_categoria) {
                throw new AppError('ID de categoría no proporcionado', 400);
            }
            const id = parseInt(id_categoria);
            const categoria = await CategoriaController.getCategoriaById(id_categoria);
            res.status(200).json(categoria);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.error('❌ Error al obtener la categoría:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
    static async createCategoria (req, res) {
        try {
            await CategoriaHandler.validarEmptyBody(req, res);
            const data = req.body;
            console.log('data', data);
            const categoria = await CategoriaController.createCategoria(data);
            res.status(201).json(categoria);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.error('❌ Error al crear la categoría:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }

    }
    static async updateCategoria(req, res) {
        try {
            await CategoriaHandler.validarEmptyBody(req, res);
            const { id_categoria } = req.params;
            const data = req.body;
            data.id_categoria = id_categoria;
            console.log('data', data);
            const categoria = await CategoriaController.updateCategoria(data);
            res.status(200).json(categoria);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.error('❌ Error al actualizar la categoría:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
    static async deleteCategoria (req, res) {
        try {
            const { id_categoria } = req.params;
            if (!id_categoria) {
                throw new AppError('ID de categoría no proporcionado', 400);
            }
            const categoria = await CategoriaController.deleteCategoria(parseInt(id_categoria));
            res.status(200).json(categoria);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            console.error('❌ Error al eliminar la categoría:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

// -----------------------------------------------------------------



    static async validarEmptyBody (req, res) {
        try {
            if (Object.keys(req.body).length === 0 || !req.body) {
                throw new AppError('El cuerpo de la solicitud está vacío', 400);
            }
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }    
        }
    }


// -----------------------------------------------------------------
}

module.exports = CategoriaHandler;