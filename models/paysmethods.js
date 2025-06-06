'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class PaysMethods extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
		}
	}
	PaysMethods.init(
		{
			name: DataTypes.STRING,
			logo: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
			api_key: DataTypes.STRING,
			access_token: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'PaysMethods',
		}
	)
	return PaysMethods
}