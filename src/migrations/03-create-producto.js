'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Producto', {
      id_producto: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre_producto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categoria',
          key: 'id_categoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      estado_producto: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'activo'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Producto');
  }
};
