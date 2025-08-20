const { Model, DataTypes } = require('sequelize');

class Presentacion extends Model {
  static initModel(sequelize) {
    Presentacion.init(
      {
        id_presentacion: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false 
        },
        nombre_presentacion: { 
        type: DataTypes.STRING, 
        allowNull: false 
        },
        descripcion: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        precio_compra: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        porcentaje_aumento: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Presentacion",
        tableName: "Presentacion",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    Presentacion.belongsTo(models.Producto, {
      foreignKey: 'id_producto',
      as: 'producto'
    });
  }
}

module.exports = Presentacion;
