'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('minio', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bucket: Sequelize.STRING,
            accessKey: Sequelize.STRING,
            secretKey: Sequelize.STRING,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('minio')
    },
}
