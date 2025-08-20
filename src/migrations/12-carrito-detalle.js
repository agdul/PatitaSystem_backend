'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Carrito_Detalle', {
      id_carrito_detalle: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_carrito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Carrito',
          key: 'id_carrito'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_presentacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Presentacion',
          key: 'id_presentacion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Carrito_Detalle');
  }
};
