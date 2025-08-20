// Modelo Genero
const { Model, DataTypes } = require('sequelize');
class Genero extends Model {
    static initModel(sequelize) {
      Genero.init({
        id_genero: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        nombre_genero: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      }, {
        sequelize,
        modelName: 'Genero',
        tableName: 'Genero',
        timestamps: false
      });
    }
  
    static associate(models) {
      Genero.hasMany(models.Usuario, {
        foreignKey: 'id_genero',
        as: 'usuarios'
      });
    }
  }
  
  module.exports = Genero;