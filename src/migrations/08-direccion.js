'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Direccion', {
      id_direccion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_localidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Localidad',
          key: 'id_localidad'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      codigo_postal: {
        type: Sequelize.STRING,
        allowNull: true
      },
      calle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      altura: {
        type: Sequelize.STRING,
        allowNull: true
      },
      piso: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dpto: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Direccion');
  }
};
