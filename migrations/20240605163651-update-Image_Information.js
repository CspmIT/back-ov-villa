'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Image_Information', 'id_information', {
			type: Sequelize.INTEGER,
			references: {
				model: 'Information',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	async down(queryInterface, Sequelize) {
	},
};
