'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categoria', {
      id_categoria: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_categoria: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_linea: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Linea',
          key: 'id_linea'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Categoria');
  }
};
