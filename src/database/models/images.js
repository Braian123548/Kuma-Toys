'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    static associate(models) {
      this.belongsTo(models.Products, { foreignKey: 'productId', as: 'product' });
    }
  }
  Images.init({
    filename: DataTypes.STRING,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Images',
  });
  return Images;
};