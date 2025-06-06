'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('PaysMethodEnableds', 'name_method');
    await queryInterface.removeColumn('PaysMethodEnableds', 'description');
  },

  async down (queryInterface, Sequelize) {

  }
};