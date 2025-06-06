'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaysDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Pays, { foreignKey: 'id_pay', as: 'pays' })
    }
  }
  PaysDetails.init({
    id_pay: DataTypes.INTEGER,
    description: DataTypes.STRING,
    customer: DataTypes.INTEGER,
    name_customer: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    reference: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PaysDetails',
  });
  return PaysDetails;
};