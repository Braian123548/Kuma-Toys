'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [{
      name: 'Product 1',
      description: 'This is product 1',
      price: 9.99,
      categoryId: 1, 
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Product 2',
      description: 'This is product 2',
      price: 19.99,
      categoryId: 1, 
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
