const db = require('../models');
const VentaDetalle = db.VentaDetalle;
const AppError = require('../utilits/helpers/errors');

class VentaDetalleService {
  constructor() {
    this.detalle = VentaDetalle;
  }

  async create(data, options = {}) {
    return await this.detalle.create(data, options);
  }

  async getByVenta(id_venta) {
    return await this.detalle.findAll({
      where: { id_venta },
      include: [
        {
          association: 'presentacion',
        },
      ],
    });
  }

  async getAll() {
    return await this.detalle.findAll({
      include: [
        {
          association: 'venta',
        },
        {
          association: 'presentacion',
        },
      ],
    });
  }
}

module.exports = VentaDetalleService;
