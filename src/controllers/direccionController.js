const direccionService = require('../services/direccionService');
const AppError = require('../utilits/helpers/errors');

class DireccionController{
//---------------------------------------------------------------
//       *** CRUD - Direccion ***

    static async getAll() {
        try {
            const direcciones = await direccionService.getAll();
            if (!direcciones || direcciones.length === 0) {
                throw new Error('No se encontraron direcciones', 404);
            };
            return direcciones;
        } catch (error) {
            throw error; 
        }
    };

    static async getById(id_direccion) {
        try {
            const direccion = await direccionService.getById(id_direccion);
            return direccion;
        } catch (error) {
            throw error; 
        }
    };

    static async create(data) {
        try {
            const direccion = await direccionService.create(data);
            return direccion;
        } catch (error) {
            throw error; 
        }
    };

    static async update(id, data) {
        try {
            // 1. Validar que la direccion existe
            await this.existeById(id);
            // 2. Actualizar   
            const direccion = await direccionService.update(id, data);
            return direccion;
        } catch (error) {
            throw error; 
        }   
    };

    static async delete(id) {
        try {
            const direccion = await direccionService.delete(id);
            return direccion;
        } catch (error) {
            throw error;
        }
    };
//---------------------------------------------------------------





//---------------------------------------------------------------
//     *** Funciones Auxiliares ***
//---------------------------------------------------------------
    static async existeById(id_direccion) {
        try {
            const direccion = await direccionService.getById(id_direccion);
            if (!direccion) {
                throw new AppError('Dirección no encontrada', 404);
            }
            return direccion;
        } catch (error) {
            throw error;
        }

    };


};

module.exports = DireccionController;

