const { Model, DataTypes } = require('sequelize');

class MetodoPago extends Model {
  static initModel(sequelize) {
    MetodoPago.init({
      id_metodo_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'MetodoPago',
      tableName: 'Metodo_Pago',
      timestamps: false
    });
  }

  static associate(models) {
    MetodoPago.hasMany(models.VentaMetodoPago, {
      foreignKey: 'id_metodo_pago',
      as: 'ventas'
    });
  }
}

module.exports = MetodoPago;
