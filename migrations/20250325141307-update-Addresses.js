'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Addresses', 'id_street');
  },

  // async down (queryInterface, Sequelize) {
  //   await queryInterface.removeColumn('Addresses', 'id_street');
  // }
};
