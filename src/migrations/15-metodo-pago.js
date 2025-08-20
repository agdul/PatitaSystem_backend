'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Metodo_Pago', {
      id_metodo_pago: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Metodo_Pago');
  }
};
