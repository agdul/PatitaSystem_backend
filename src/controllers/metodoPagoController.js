const MetodoPagoService = require('../services/metodoPagoService');
const metodoPagoService = new MetodoPagoService();
const AppError = require('../utilits/helpers/errors');

class MetodoPagoController {
  static async getAll() {
    try {
      const metodos = await metodoPagoService.getAll();
      if (!metodos || metodos.length === 0) {
        throw new AppError('No se encontraron métodos de pago', 404);
      }
      return metodos;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id_metodo_pago) {
    try {
      const metodo = await metodoPagoService.getById(id_metodo_pago);
      return metodo;
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      if (!data.descripcion) {
        throw new AppError('La descripción del método de pago es obligatoria', 400);
      }
      return await metodoPagoService.create(data);
    } catch (error) {
      throw error;
    }
  }

  static async existeById(id_metodo_pago) {
    try {
      return await metodoPagoService.existeById(id_metodo_pago);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MetodoPagoController;
