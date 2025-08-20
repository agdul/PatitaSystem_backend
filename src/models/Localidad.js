// Modelo Localidad
const { Model, DataTypes } = require('sequelize');
class Localidad extends Model {
    static initModel(sequelize) {
      Localidad.init({
        id_localidad: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        id_provincia: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Provincia',
            key: 'id_provincia'
          }
        },
        nombre_localidad: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        sequelize,
        modelName: 'Localidad',
        tableName: 'Localidad',
        timestamps: false
      });
    }
  
    static associate(models) {
      Localidad.belongsTo(models.Provincia, {
        foreignKey: 'id_provincia',
        as: 'provincia'
      });
      Localidad.hasMany(models.Direccion, {
        foreignKey: 'id_localidad',
        as: 'direcciones'
      });
    }
  }
  
  module.exports = Localidad;