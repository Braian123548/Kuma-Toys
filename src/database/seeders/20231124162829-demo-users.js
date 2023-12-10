'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      first_name: 'John Doe',
      last_name:"koala",
      image:"jdjdhkjahdj",
      direccion:"Avila s/n",
      cp:"5060",
      email: 'john@example.com',
      password: '$2b$10$L9boxxxEf5rAhL/eS0p1YeZDhFGYw3zuKo4D5azE75D0JyzyZmeR2',
      rol:"admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
