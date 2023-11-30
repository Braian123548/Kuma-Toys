'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const favoritesData = [
      { userId: 1, productId: 1, createdAt: new Date(), updatedAt: new Date() },
      // Agrega más datos aquí según tus necesidades
    ];

    return queryInterface.bulkInsert('Favorites', favoritesData);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Favorites', null, {});
  }
};
