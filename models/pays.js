'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pays.init({
    id_user: DataTypes.INTEGER,
    name_user: DataTypes.STRING,
    total: DataTypes.DECIMAL,
    id_method: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    message: DataTypes.STRING,
    type_pay: DataTypes.STRING,
    id_external: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Pays',
  });
  return Pays;
};