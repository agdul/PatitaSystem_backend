const db = require('../models');
const Venta = db.Venta;
const Usuario = db.Usuario;
const VentaDetalle = db.VentaDetalle;
const MetodoPago = db.MetodoPago;
const VentaMetodoPago = db.VentaMetodoPago;
const AppError = require('../utilits/helpers/errors');

class VentaService {
  constructor() {
    this.venta = Venta;
  }

  async create(data, options = {}) {
    return await this.venta.create(data, options);
  }

  async getAll() {
    return await this.venta.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
        },
        {
          model: VentaDetalle,
          as: 'detalles',
        },
        {
          model: VentaMetodoPago,
          as: 'metodos_pago',
          include: [
            {
              model: MetodoPago,
              as: 'metodo'
            }
          ]
        }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  async getByUsuario(id_usuario) {
    return await this.venta.findAll({
      where: { id_usuario },
      include: [
        {
          model: VentaDetalle,
          as: 'detalles',
        },
        {
          model: VentaMetodoPago,
          as: 'metodos_pago',
          include: [
            {
              model: MetodoPago,
              as: 'metodo'
            }
          ]
        }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  async getById(id_venta) {
    return await this.venta.findOne({
      where: { id_venta },
      include: [
        {
          model: Usuario,
          as: 'usuario',
        },
        {
          model: VentaDetalle,
          as: 'detalles',
        },
        {
          model: VentaMetodoPago,
          as: 'metodos_pago',
          include: [
            {
              model: MetodoPago,
              as: 'metodo'
            }
          ]
        }
      ]
    });
  }

  async existeById(id_venta) {
    const venta = await this.venta.findOne({ where: { id_venta } });
    if (!venta) {
      throw new AppError('Venta no encontrada', 404);
    }
    return venta;
  }
}

module.exports = VentaService;
