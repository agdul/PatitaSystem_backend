'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Provincia', {
      id_provincia: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_provincia: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Provincia');
  }
};
