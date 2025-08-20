// Modelo Rol
const { Model, DataTypes } = require('sequelize');
class Rol extends Model {
    static initModel(sequelize) {
      Rol.init({
        id_rol: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        nombre_rol: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      }, {
        sequelize,
        modelName: 'Rol',
        tableName: 'Rol',
        timestamps: false
      });
    }
  
    static associate(models) {
      Rol.hasMany(models.Usuario, {
        foreignKey: 'id_rol',
        as: 'usuarios'
      });
    }
  }
  
  module.exports = Rol;