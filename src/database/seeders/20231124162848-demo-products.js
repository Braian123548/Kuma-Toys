'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [{
      name: 'Product 1',
      description: 'This is product 1',
      descripcion: 'This is producto 1 que cuenta con una amplia tecnologia ademas de estar hecha con los siguientes materiales ',
      price: 9.99,
      categoryId: 1,
      cantidad: 10, 
      imagen: 'mulyadi-bsMnWtskoCU-unsplash.jpg', 
      descuento: 0.1, 
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
