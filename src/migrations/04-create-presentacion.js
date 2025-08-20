'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Presentacion', {
      id_presentacion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_presentacion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Producto',
          key: 'id_producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      precio_compra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      porcentaje_aumento: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Presentacion');
  }
};