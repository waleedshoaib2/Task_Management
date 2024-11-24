'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tenants', [
      {
        name: 'Demo Company',
        email: 'demo@company.com',
        password: await bcrypt.hash('password123', 10), // Hash password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tenants', null, {});
  },
};
