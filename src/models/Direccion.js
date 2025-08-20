// Modelo Direccion
const { Model, DataTypes } = require('sequelize');
class Direccion extends Model {
    static initModel(sequelize) {
      Direccion.init({
        id_direccion: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        id_localidad: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Localidad',
            key: 'id_localidad'
          }
        },
        codigo_postal: {
          type: DataTypes.STRING,
          allowNull: true
        },
        calle: {
          type: DataTypes.STRING,
          allowNull: false
        },
        altura: {
          type: DataTypes.STRING,
          allowNull: true
        },
        piso: {
          type: DataTypes.STRING,
          allowNull: true
        },
        dpto: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
        sequelize,
        modelName: 'Direccion',
        tableName: 'Direccion',
        timestamps: false
      });
    }
  
    static associate(models) {
      Direccion.belongsTo(models.Localidad, {
        foreignKey: 'id_localidad',
        as: 'localidad'
      });
      Direccion.hasMany(models.Usuario, {
        foreignKey: 'id_direccion',
        as: 'usuarios'
      });
    }
  }
  
  module.exports = Direccion;