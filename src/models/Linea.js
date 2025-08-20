const { Model, DataTypes } = require('sequelize');

class Linea extends Model {
  static initModel(sequelize) {
    Linea.init({
      id_linea: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre_linea: { type: DataTypes.STRING, allowNull: false }
    }, {
      sequelize,
      modelName: 'Linea',
      tableName: 'Linea',
      timestamps: false
    });
  }

  static associate(models) {
    Linea.hasMany(models.Categoria, {
      foreignKey: 'id_linea',
      as: 'categorias'
    });
  }
}

module.exports = Linea;
