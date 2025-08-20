'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Localidad', {
      id_localidad: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_provincia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Provincia',
          key: 'id_provincia'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      nombre_localidad: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Localidad');
  }
};
