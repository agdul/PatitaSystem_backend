const { Model, DataTypes } = require('sequelize');

class CarritoDetalle extends Model {
  static initModel(sequelize) {
    CarritoDetalle.init({
      id_carrito_detalle: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_carrito: { type: DataTypes.INTEGER, allowNull: false },
      id_presentacion: { type: DataTypes.INTEGER, allowNull: false },
      cantidad: { type: DataTypes.INTEGER, allowNull: false },
      precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
      sequelize,
      modelName: 'CarritoDetalle',
      tableName: 'Carrito_Detalle',
      timestamps: false
    });
  }

  static associate(models) {
    CarritoDetalle.belongsTo(models.Carrito, {
      foreignKey: 'id_carrito',
      as: 'carrito'
    });

    CarritoDetalle.belongsTo(models.Presentacion, {
      foreignKey: 'id_presentacion',
      as: 'presentacion'
    });
  }
}

module.exports = CarritoDetalle;
