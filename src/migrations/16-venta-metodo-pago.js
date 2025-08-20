'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venta_Metodo_Pago', {
      id_venta_metodo_pago: {
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
      id_metodo_pago: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Metodo_Pago',
          key: 'id_metodo_pago'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Venta_Metodo_Pago');
  }
};
