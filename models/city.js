'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class City extends Model {
		static associate(models) {
			City.hasMany(models.Address, {
				foreignKey: 'id_city',
				sourceKey: 'cod_loc',
			})
		}
	}
	City.init(
		{
			cod_loc: DataTypes.BIGINT,
			des_loc: DataTypes.STRING,
			cod_pos: DataTypes.BIGINT,
			cod_pci: DataTypes.BIGINT,
		},
		{
			sequelize,
			modelName: 'City',
		}
	)
	return City
}
