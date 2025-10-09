const DireccionController = require('../controllers/direccionController');
const AppError = require('../utilits/helpers/errors');

class DireccionHandler {

// ---------------------------------------------------------------   
//       *** CRUD - Direccion ***

static async getDireccion(req, res) {
    try {
        //Desetructuracion de la request para obtener el id de la direccion
        const { id } = req.params;
        // Si recibo parametro busco por id, sino busco todas las direcciones
        const direccion = id ? await DireccionController.getById(id) : await DireccionController.getAll();
        res.status(200).json(direccion);
    } catch (error) {
        console.error('❌ Error al obtener la dirección:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        } 
    }
};

static async createDireccion(req, res) { 
    try {
        //Desetructuracion de la request para obtener los datos de la direccion
        const data = req.body;
        if (!data) {
            return res.status(400).json({ message: 'Datos de la dirección son requeridos' });
        }

        // Si viene piso, tiene que estar tmb el departamento
        if (data.piso && !data.dpto) {
            return res.status(400).json({ message: 'Si se ingresa piso, el departamento es obligatorio' });
        }
        const direccion = await DireccionController.create(data);
        res.status(201).json(direccion);

    } catch (error) {
        console.error('❌ Error al crear la dirección:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }   
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

static async updateDireccion(req, res) {
    try {
        // Desetructuracion de la request para obtener el id de la direccion y los datos a actualizar
        const { id } = req.params;
        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: 'Datos de la dirección son requeridos' });
        }
        const direccion = await DireccionController.update(id, data);
        res.status(200).json(direccion);
    } catch (error) {
        console.error('❌ Error al actualizar la dirección:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }       
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });   
    }
};

static async deleteDireccion(req, res) {
    try {
        // Desetructuracion de la request para obtener el id de la direccion
        const { id } = req.params;
        if (!id) {
            return AppError('ID de la dirección es requerido', 400);
        }
        await DireccionController.delete(id);
        res.status(200).json({ message: 'Dirección eliminada exitosamente' });
    } catch (error) {
        console.error('❌ Error al eliminar la dirección:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        
    }
};
// ---------------------------------------------------------------
};

module.exports = DireccionHandler;