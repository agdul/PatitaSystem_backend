const LineaController = require('../controllers/lineaController');
const AppError = require('../utilits/helpers/errors');

class LineaHandler{

// -----------------------------------------------------------------
//  ***/***/***/***/***/***/CRUD Linea ***/***/***/***/***/***/
// -----------------------------------------------------------------


static async getLineas (req, res) {
    try {
        const lineas = await LineaController.getLineas();
        res.status(200).json(lineas);
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('❌ Error al obtener las líneas:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}


static async getLineaById (req, res) {
    try {
        const { id_linea } = req.params;
        if (!id_linea) {
            throw new AppError('ID de línea no proporcionado', 400);
        }
        const id = parseInt(id_linea);
        const linea = await LineaController.getLineaById(id);
        res.status(200).json(linea);

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('❌ Error al obtener la línea:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }

}


static async createLinea (req, res) {   
    try {
        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('El cuerpo de la solicitud está vacío', 400);
        }
        console.log('data', data);
        const linea = await LineaController.createLinea(data);
        res.status(201).json(linea);
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('❌ Error al crear la línea:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    } 
}

static async updateLinea (req, res) {
    try {
        const { id_linea } = req.params;
        if (!id_linea) {
            throw new AppError('ID de línea no proporcionado', 400);
        }
        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            throw new AppError('El cuerpo de la solicitud está vacío', 400);
        }   
        parseInt(id_linea);
        console.log('data', data);
        const linea = await LineaController.updateLineaid(id_linea, data);
        res.status(200).json(linea);
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('❌ Error al actualizar la línea:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
        
    }
}

static async deleteLinea (req, res) {
    try {
        const { id_linea } = req.params;
        if (!id_linea) {
            throw new AppError('ID de línea no proporcionado', 400);
        }
        const linea = await LineaController.deleteLinea(parseInt(id_linea));
        res.status(200).json(linea);

    } catch (error) {

        if (error instanceof AppError) {    
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.error('❌ Error al eliminar la línea:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message});
    }
}


// -----------------------------------------------------------------

}

module.exports = LineaHandler;