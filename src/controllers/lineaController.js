const db = require('../models');
const LineaService = require("../services/lineaService");
const lineaService = new LineaService();

const AppError = require("../utilits/helpers/errors");

class LineaController {
    // -----------------------------------------------------------------------
    //------------------   CRUD LINEA   ---------------------------
    // -----------------------------------------------------------------------
    static async getLineas() {
        try {
            const lineas = await lineaService.getAll();
            if (!lineas || lineas.length === 0) {
                throw new AppError("No se encontraron líneas", 404);
            }
            return lineas;
        } catch (error) {
            throw error;
        }
    }

    static async getLineaById(id_linea) {
        try {
            const linea = await lineaService.getById(id_linea);
            if (!linea) {
                throw new AppError("Línea no encontrada", 404);
            }
            return linea;
        } catch (error) {
            throw error;
        }
    }

    static async createLinea(data) {
        try {
            const nuevaLinea = await lineaService.create(data);
            if (!nuevaLinea) {
                throw new AppError("Error al crear la línea", 400);
            }
            return nuevaLinea;
        } catch (error) {
            throw error;
        }
    }

    static async updateLinea(data) {
        try {
            const { id_linea, nombre_linea } = data;   
            // -----------------------------------------------------------------------
            // Verificar existencia
            const lineaActual = await lineaService.getById(id_linea);   
            if (!lineaActual) {
                throw new AppError("Línea no encontrada", 404);
            };
            // Verificar validación de nombre al service
            await lineaService.verificarNombreDisponible(nombre_linea,id_linea);
            // -----------------------------------------------------------------------
            const lineaActualizada = await lineaService.update(data);
            if (!lineaActualizada) {
                throw new AppError("Error al actualizar la línea", 400);
            }
            return lineaActualizada;
        } catch (error) {
            throw error;
        }
    }

    static async deleteLinea(id_linea) {
        try {
            const linea = await lineaService.getById(id_linea);
            if (!linea) {
                throw new AppError("Línea no encontrada", 404);
            }
            const resultado = await lineaService.delete(id_linea);
            if (!resultado) {
                throw new AppError("Error al eliminar la línea", 400);
            }   
            return resultado;
        } catch (error) {
            throw error;
        }      
    }

    // -----------------------------------------------------------------------
    
}

module.exports = LineaController;



