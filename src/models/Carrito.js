const { Model, DataTypes } = require('sequelize');

class Carrito extends Model {
  static initModel(sequelize) {
    Carrito.init({
      id_carrito: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      id_usuario: { type: DataTypes.INTEGER, allowNull: false },
      estado: { type: DataTypes.STRING(50), allowNull: false }
    }, {
      sequelize,
      modelName: 'Carrito',
      tableName: 'Carrito',
      timestamps: false
    });
  }

  static associate(models) {
    Carrito.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    Carrito.hasMany(models.CarritoDetalle, {
      foreignKey: 'id_carrito',
      as: 'detalles'
    });
  }
}

module.exports = Carrito;
