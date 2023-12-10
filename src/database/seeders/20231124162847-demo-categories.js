'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categoriesData = [
      { name: 'Disney', description: 'Productos de Disney', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Marvel', description: 'Productos de Marvel', createdAt: new Date(), updatedAt: new Date() },
      { name: 'DC', description: 'Productos de DC', createdAt: new Date(), updatedAt: new Date() },
      // Agrega más datos aquí según tus necesidades
    ];

    return queryInterface.bulkInsert('Categories', categoriesData);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
