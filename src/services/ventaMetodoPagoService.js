const db = require('../models');
const VentaMetodoPago = db.VentaMetodoPago;
const AppError = require('../utilits/helpers/errors');

class VentaMetodoPagoService {
  constructor() {
    this.vm = VentaMetodoPago;
  }

  async create(data, options = {}) {
    return await this.vm.create(data, options);
  }

  async getByVenta(id_venta) {
    return await this.vm.findAll({
      where: { id_venta },
      include: [
        {
          association: 'metodoPago',
        },
      ],
    });
  }

  async getAll() {
    return await this.vm.findAll({
      include: ['venta', 'metodoPago'],
    });
  }
}

module.exports = VentaMetodoPagoService;
