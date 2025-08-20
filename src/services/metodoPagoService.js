const db = require('../models');
const MetodoPago = db.MetodoPago;
const AppError = require('../utilits/helpers/errors');

class MetodoPagoService {
  constructor() {
    this.metodoPago = MetodoPago;
  }

  async getAll() {
    return await this.metodoPago.findAll();
  }

  async getById(id_metodo_pago) {
    const metodo = await this.metodoPago.findOne({
      where: { id_metodo_pago }
    });

    if (!metodo) {
      throw new AppError('Método de pago no encontrado', 404);
    }

    return metodo;
  }

  async create(data) {
    return await this.metodoPago.create(data);
  }

  async existeById(id_metodo_pago) {
    const metodo = await this.metodoPago.findByPk(id_metodo_pago);
    if (!metodo) {
      throw new AppError('Método de pago no existe', 404);
    }
    return metodo;
  }
}

module.exports = MetodoPagoService;
