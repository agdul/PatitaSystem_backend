'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venta_Detalle', {
      id_venta_detalle: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Venta',
          key: 'id_venta'
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
        onDelete: 'RESTRICT'
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Venta_Detalle');
  }
};
