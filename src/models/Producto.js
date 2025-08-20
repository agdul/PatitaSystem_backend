const { Model, DataTypes } = require('sequelize');

class Producto extends Model {
  static initModel(sequelize) {
    Producto.init({
      id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_producto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      id_categoria: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categoria',
          key: 'id_categoria'
        }
      },
      estado_producto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      modelName: 'Producto',
      tableName: 'Producto',
      timestamps: true
    });
  }

  static associate(models) {
    Producto.belongsTo(models.Categoria, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });

    Producto.hasMany(models.Presentacion, {
      foreignKey: 'id_producto',
      as: 'presentaciones'
    });
  }
}

module.exports = Producto;
