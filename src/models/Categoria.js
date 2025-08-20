const { Model, DataTypes } = require('sequelize');

class Categoria extends Model {
  static initModel(sequelize) {
    Categoria.init({
      id_categoria: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre_categoria: { type: DataTypes.STRING, allowNull: false },
      id_linea: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      sequelize,
      modelName: 'Categoria',
      tableName: 'Categoria',
      timestamps: false
    });
  }

  static associate(models) {
    Categoria.hasMany(models.Producto, {
      foreignKey: 'id_categoria',
      as: 'productos'
    });
    Categoria.belongsTo(models.Linea, {
      foreignKey: 'id_linea',
      as: 'linea'
    });
  }
}

module.exports = Categoria;
