'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categoriesData = [
      { name: 'Category 1', description: 'Description for Category 1', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Category 2', description: 'Description for Category 2', createdAt: new Date(), updatedAt: new Date() },
      // Agrega más datos aquí según tus necesidades
    ];

    return queryInterface.bulkInsert('Categories', categoriesData);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
