'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Claim', 'name_customer', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Claim', 'name_customer');
  }
};
