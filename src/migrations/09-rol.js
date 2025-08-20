'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rol', {
      id_rol: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_rol: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Rol');
  }
};
