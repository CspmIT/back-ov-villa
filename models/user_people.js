'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class User_People extends Model {
		static associate(models) {
			User_People.belongsTo(models.Person, { foreignKey: 'id_person', as: 'data_Person' })
			User_People.belongsTo(models.User, { foreignKey: 'id_user', as: 'User' })
		}
	}
	User_People.init(
		{
			id_user: DataTypes.INTEGER,
			id_person: DataTypes.INTEGER,
			level: DataTypes.INTEGER,
			primary_account: DataTypes.BOOLEAN,
			status: DataTypes.BOOLEAN,
			customer_number: DataTypes.INTEGER,
			customer_last_name: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'User_People',
		}
	)
	return User_People
}
