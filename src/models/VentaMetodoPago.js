const { Model, DataTypes } = require('sequelize');

class VentaMetodoPago extends Model {
  static initModel(sequelize) {
    VentaMetodoPago.init({
      id_venta_metodo_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_metodo_pago: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'VentaMetodoPago',
      tableName: 'Venta_Metodo_Pago',
      timestamps: false
    });
  }

  static associate(models) {
    VentaMetodoPago.belongsTo(models.Venta, {
      foreignKey: 'id_venta',
      as: 'venta'
    });

    VentaMetodoPago.belongsTo(models.MetodoPago, {
      foreignKey: 'id_metodo_pago',
      as: 'metodo'
    });
  }
}

module.exports = VentaMetodoPago;
