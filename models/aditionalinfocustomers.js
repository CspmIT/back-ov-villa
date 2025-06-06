'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AditionalInfoCustomers extends Model {
    static associate(models) {}
  }
  AditionalInfoCustomers.init({
    nombre: DataTypes.STRING,
    domicilio: DataTypes.STRING,
    telefono: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    codigo:  DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'AditionalInfoCustomers',
  });
  return AditionalInfoCustomers;
};