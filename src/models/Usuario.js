// Modelo Usuario
const { Model, DataTypes } = require('sequelize');
class Usuario extends Model {
    static initModel(sequelize) {
      Usuario.init({
        id_usuario: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        id_direccion: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Direccion',
            key: 'id_direccion'
          }
        },
        id_rol: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Rol',
            key: 'id_rol'
          }
        },
        id_genero: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Genero',
            key: 'id_genero'
          }
        },
        dni_usuario: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        apellido_usuario: {
          type: DataTypes.STRING,
          allowNull: false
        },
        nombre_usuario: {
          type: DataTypes.STRING,
          allowNull: false
        },
        usuario: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email_usuario: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        estado_usuario: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        fec_nac: {
          type: DataTypes.DATE,
          allowNull: true
        },
        celular_usuario: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
        sequelize,
        modelName: 'Usuario',
        tableName: 'Usuario',
        timestamps: true
      });
    }
  
    static associate(models) {
      Usuario.belongsTo(models.Direccion, {
        foreignKey: 'id_direccion',
        as: 'direccion'
      });
      Usuario.belongsTo(models.Rol, {
        foreignKey: 'id_rol',
        as: 'rol'
      });
      Usuario.belongsTo(models.Genero, {
        foreignKey: 'id_genero',
        as: 'genero'
      });
    }
  }
  
  module.exports = Usuario;