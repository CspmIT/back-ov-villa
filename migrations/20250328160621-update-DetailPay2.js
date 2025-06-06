'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('PaysDetails', 'account', 'customer');
    await queryInterface.addColumn('PaysDetails', 'name_customer', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('PaysDetails', 'ss');
  },

  async down (queryInterface, Sequelize) {
  }
};