// Modelo Provincia
const { Model, DataTypes } = require('sequelize');

class Provincia extends Model {
  static initModel(sequelize) {
    Provincia.init({
      id_provincia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,   
        primaryKey: true
      },
      nombre_provincia: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      modelName: 'Provincia',
      tableName: 'Provincia',
      timestamps: false
    });
  }

  static associate(models) {
    Provincia.hasMany(models.Localidad, {
      foreignKey: 'id_provincia',
      as: 'localidades'
    });
  }
}

module.exports = Provincia;