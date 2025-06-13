'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('People', 'number_customer');

  },

  async down (queryInterface, Sequelize) {
    }
};