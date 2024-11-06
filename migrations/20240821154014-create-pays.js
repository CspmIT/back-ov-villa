'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pays', {
      id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			id_user: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			customer: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			name_customer: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			total: {
				allowNull: false,
				type: Sequelize.DECIMAL(18, 2),
			},
			id_external: {
				type: Sequelize.STRING,
			},
			type_pay: {
				type: Sequelize.STRING,
			},
			id_method: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			status: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			message: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pays');
  }
};