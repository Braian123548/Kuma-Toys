'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const shoppingCartsData = [
      { userId: 1, productId: 1, quantity: 1, createdAt: new Date(), updatedAt: new Date() },
      // Agrega más datos aquí según tus necesidades
    ];

    return queryInterface.bulkInsert('ShoppingCarts', shoppingCartsData);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ShoppingCarts', null, {});
  }
};
