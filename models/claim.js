const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Claim extends Model {
    static associate(models) {}
  }
  Claim.init({
    description: DataTypes.STRING,
    type: DataTypes.INTEGER,
    service: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    user_id: DataTypes.INTEGER,
    customer: DataTypes.STRING,
    observations: DataTypes.STRING,
    signName: DataTypes.STRING,
    signLastName: DataTypes.STRING,
    signDni: DataTypes.STRING,
    signPhone: DataTypes.STRING,
    signImage: DataTypes.STRING,
    address: DataTypes.STRING,
    name_customer: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Claim',
    tableName: 'Claim'
  });

  return Claim;
};
