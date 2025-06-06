'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Claim', 'signName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Claim', 'signLastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Claim', 'signDni', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Claim', 'signPhone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Claim', 'signImage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Claim', 'signName');
    await queryInterface.removeColumn('Claim', 'signLastName');
    await queryInterface.removeColumn('Claim', 'signDni');
    await queryInterface.removeColumn('Claim', 'signPhone');
    await queryInterface.removeColumn('Claim', 'signImage');
  }
};
