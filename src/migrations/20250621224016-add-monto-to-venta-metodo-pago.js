module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Venta_Metodo_Pago', 'monto', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Venta_Metodo_Pago', 'monto');
  }
};
