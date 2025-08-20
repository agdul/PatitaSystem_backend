const { Model, DataTypes } = require('sequelize');

class Venta extends Model {
  static initModel(sequelize) {
    Venta.init({
      id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Venta',
      tableName: 'Venta',
      timestamps: false
    });
  }

  static associate(models) {
    Venta.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    Venta.hasMany(models.VentaDetalle, {
      foreignKey: 'id_venta',
      as: 'detalles'
    });

    Venta.hasMany(models.VentaMetodoPago, {
      foreignKey: 'id_venta',
      as: 'metodos_pago'
    });
  }
}

module.exports = Venta;
