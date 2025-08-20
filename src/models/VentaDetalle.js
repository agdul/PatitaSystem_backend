const { Model, DataTypes } = require('sequelize');

class VentaDetalle extends Model {
  static initModel(sequelize) {
    VentaDetalle.init({
      id_venta_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_presentacion: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'VentaDetalle',
      tableName: 'Venta_Detalle',
      timestamps: false
    });
  }

  static associate(models) {
    VentaDetalle.belongsTo(models.Venta, {
      foreignKey: 'id_venta',
      as: 'venta'
    });

    VentaDetalle.belongsTo(models.Presentacion, {
      foreignKey: 'id_presentacion',
      as: 'presentacion'
    });
  }
}

module.exports = VentaDetalle;
