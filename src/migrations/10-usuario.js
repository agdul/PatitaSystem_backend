'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_direccion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Direccion',
          key: 'id_direccion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'id_rol'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      id_genero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Genero',
          key: 'id_genero'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      dni_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      apellido_usuario: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nombre_usuario: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      estado_usuario: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fec_nac: {
        type: Sequelize.DATE,
        allowNull: true
      },
      celular_usuario: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Usuario');
  }
};
