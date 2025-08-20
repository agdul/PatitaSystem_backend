const PresentacionController = require('../controllers/presentacionController');
const AppError = require('../utilits/helpers/errors');

class PresentacionHandler {
    static async getAllByProducto(req, res) {
        try {
            const { id } = req.params;
            const presentacion = await PresentacionController.getAllByProducto(id);
            if (!presentacion || presentacion.length === 0) {
                throw new AppError('No se encontraron presentaciones', 404);
            }
            
            res.status(200).json(presentacion);
        } catch (error) {
            if (error.message === 'No se encontraron presentaciones') {
                return res.status(404).json({ message: error.message });
            }
            console.error('❌ Error al obtener la presentación:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getPresentacion(req, res) {
        try {
            const { id, id_presentacion } = req.params;
    
            if (id_presentacion) {
                const presentacion = await PresentacionController.getById(id_presentacion);
    
                if (!presentacion) {
                    throw new AppError('Presentación no encontrada', 404);
                }
    
                if (presentacion.producto.id_producto.toString() !== id.toString()) {
                    throw new AppError('La presentación no pertenece al producto indicado', 400);
                }
    
                res.status(200).json(presentacion);
            } else {
                // Si no mandan id_presentacion, devolver todas las presentaciones del producto
                const presentaciones = await PresentacionController.getAllByProducto(id);
                if (!presentaciones || presentaciones.length === 0) {
                    throw new AppError('No se encontraron presentaciones', 404);
                }
                res.status(200).json(presentaciones);
            }
        } catch (error) {
            console.error('❌ Error al obtener la presentación:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async createPresentacion(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: 'Datos de la presentación requeridos' });
            }
            data.id_producto = id;
            const presentacion = await PresentacionController.create(data);
            res.status(201).json(presentacion);
        } catch (error) {
            console.error('❌ Error al crear la presentación:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
    
    static async updatePresentacion(req, res) {
        try {
            const { id_presentacion} = req.params;
            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({ message: 'Datos de la presentación requeridos' });
            
            }
            
            const presentacion = await PresentacionController.update(id_presentacion, data);
            res.status(200).json(presentacion);
        } catch (error) {
            console.error('❌ Error al actualizar la presentación:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async deletePresentacion(req, res) {
        try {
            const { id_presentacion } = req.params;
            const deleted = await PresentacionController.delete(id_presentacion);
            if (!deleted) {
                return res.status(404).json({ message: 'Presentación no encontrada' });
            }
            res.status(200).json({ message: 'Presentación eliminada correctamente' });
        } catch (error) {
            console.error('❌ Error al eliminar la presentación:', error);
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }

    static async getTodasPresentaciones(req, res) {
        try {
            const presentaciones = await PresentacionController.getTodasPresentaciones();
            if (!presentaciones || presentaciones.length === 0) {
                throw new AppError('No se encontraron presentaciones', 404);
            }
            res.status(200).json(presentaciones);
        } catch (error) {
            console.error('❌ Error al obtener todas las presentaciones:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        }
    }
}

module.exports = PresentacionHandler;
